import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockTrades } from "@/lib/data";
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Upload } from "lucide-react";

export default function TradesPage() {
    return (
        <Card className="animate-in fade-in-0">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">All Trades</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filter</Button>
                    <Button variant="outline"><Upload className="mr-2 h-4 w-4"/>Import</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Instrument</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Entry Price</TableHead>
                            <TableHead>Exit Price</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Entry Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">P/L</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTrades.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell className="font-medium">{trade.instrument}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={trade.type === 'Long' ? 'text-chart-2 border-chart-2' : 'text-chart-5 border-chart-5'}>
                                        {trade.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono">${trade.entryPrice.toLocaleString()}</TableCell>
                                <TableCell className="font-mono">{trade.status === 'Closed' ? `$${trade.exitPrice.toLocaleString()}` : '-'}</TableCell>
                                <TableCell className="font-mono">{trade.size}</TableCell>
                                <TableCell>{format(parseISO(trade.entryDate), 'PPpp')}</TableCell>
                                <TableCell>
                                    <Badge variant={trade.status === 'Open' ? 'outline' : 'secondary'} className={trade.status === 'Open' ? 'border-primary text-primary animate-pulse' : ''}>
                                        {trade.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-mono ${trade.pnl > 0 ? 'text-chart-2' : trade.pnl < 0 ? 'text-chart-5' : 'text-foreground'}`}>
                                    {trade.status === 'Closed' ? `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}` : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
