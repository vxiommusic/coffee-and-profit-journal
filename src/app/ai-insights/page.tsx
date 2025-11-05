import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AiInsightsPage() {
    return (
        <Card className="animate-in fade-in-0">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Bot className="text-primary"/>
                    Аналитика на базе ИИ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-bold tracking-tight">ИИ-анализ в процессе</h2>
                    <p className="text-muted-foreground max-w-md">
                        Наш ИИ сканирует ваши сделки на предмет повторяющихся паттернов, оптимальных точек входа/выхода и факторов риска. Загляните позже за полезными идеями.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
