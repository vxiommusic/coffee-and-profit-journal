import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <Card className="animate-in fade-in-0">
            <CardHeader>
                <CardTitle className="font-headline">Настройки</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-bold tracking-tight">Настройки скоро появятся</h2>
                    <p className="text-muted-foreground">
                        Скоро вы сможете устанавливать параметры риска и подключать свои брокерские счета.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
