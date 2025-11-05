import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AiInsightsPage() {
    return (
        <Card className="animate-in fade-in-0">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Bot className="text-primary"/>
                    AI-Powered Insights
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-bold tracking-tight">AI Analysis in Progress</h2>
                    <p className="text-muted-foreground max-w-md">
                        Our AI is scanning your trades for recurring patterns, optimal entry/exit points, and risk factors. Check back soon for actionable insights.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
