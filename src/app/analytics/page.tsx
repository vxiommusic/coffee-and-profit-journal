import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
    return (
        <Card className="animate-in fade-in-0">
            <CardHeader>
                <CardTitle className="font-headline">Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-bold tracking-tight">Coming Soon</h2>
                    <p className="text-muted-foreground">
                        In-depth analytics and performance breakdowns are on their way.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
