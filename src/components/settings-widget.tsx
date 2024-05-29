import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";

export const SettingsWidget = () => {
  const variants = [
    "background",
    "foreground",
    "primary",
    "secondary",
    "destructive",
    "muted",
    "accent",
    "popover",
    "card",
  ];
  const { setTheme, theme } = useTheme();

  const Palette = ({ mode }: { mode: string }) => (

    <div className={"grid grid-cols-4 gap-4 " + mode}>
      {variants.map((variant, index) => (
        <div
          key={index}
          className={`flex border justify-center items-center p-5 rounded-lg bg-${variant} text-${variant}-foreground transition-transform duration-200 hover:scale-150 hover:z-10`}
        >
          {variant}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex space-y-4 flex-col">
      <Card className="p-4">
        <CardTitle>
          Color Themes
        </CardTitle>
        <CardContent className="p-2 flex gap-2 flex-wrap">
          <Button onClick={() => {
            setTheme('dark')
          }}>
            Dark
          </Button>
          <Button onClick={() => {
            setTheme('light')
          }}>
            Light
          </Button>
          <Button onClick={() => {
            setTheme('cyberpunk')
          }}>
            Cyberpunk
          </Button>
          <Button onClick={() => {
            setTheme('zen-garden')
          }}>
            Zen Garden
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
