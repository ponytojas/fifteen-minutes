import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "@/i18n";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InfoDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("info.title")}</DialogTitle>
          <DialogDescription>{t("info.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-foreground">
          <section>
            <h3 className="mb-1 font-semibold">{t("info.whatIs")}</h3>
            <p className="text-muted-foreground">{t("info.whatIsBody")}</p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">{t("info.howTo")}</h3>
            <p className="text-muted-foreground">{t("info.howToBody")}</p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">{t("info.tips")}</h3>
            <p className="text-muted-foreground">{t("info.tipsBody")}</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
