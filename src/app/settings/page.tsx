import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <Card className="animate-in fade-in-0">
            <CardHeader>
                <CardTitle className="font-headline">Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-bold tracking-tight">Customization Coming Soon</h2>
                    <p className="text-muted-foreground">
                        Soon you'll be able to set risk parameters and connect your brokerage accounts.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
