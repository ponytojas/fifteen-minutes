import { z } from "zod/v4";

const LonLatSchema = z.tuple([z.number(), z.number()]);
const RingSchema = z.array(LonLatSchema).min(4);
const PolygonCoordinatesSchema = z.array(RingSchema).min(1);
const MultiPolygonCoordinatesSchema = z.array(PolygonCoordinatesSchema).min(1);

export const CityBoundarySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Polygon"),
    coordinates: PolygonCoordinatesSchema,
  }),
  z.object({
    type: z.literal("MultiPolygon"),
    coordinates: MultiPolygonCoordinatesSchema,
  }),
]);

export const CityMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  boundary: CityBoundarySchema.optional(),
  center: z.tuple([z.number(), z.number()]),
  defaultH3Res: z.number().int().min(0).max(15),
});

export const PoiPackSchema = z.object({
  categories: z.array(z.string()),
  pois: z.array(
    z.object({
      lat: z.number(),
      lon: z.number(),
      cat: z.number().int().min(0),
      name: z.string().optional(),
    }),
  ),
});

export const StopSchema = z.object({
  id: z.string(),
  lat: z.number(),
  lon: z.number(),
  freqWk: z.array(z.number()).length(24),
  freqWe: z.array(z.number()).length(24),
  routesWk: z.array(z.number()).length(24),
  routesWe: z.array(z.number()).length(24),
});

export const StopsPackSchema = z.object({
  stops: z.array(StopSchema),
});

export const H3PackSchema = z.object({
  res: z.number().int(),
  hexes: z.array(z.string()),
});
