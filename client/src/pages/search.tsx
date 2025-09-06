import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { searchRequestSchema, type SearchRequest } from "@shared/schema";
import { Search, Receipt } from "lucide-react";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  
  const form = useForm<SearchRequest>({
    resolver: zodResolver(searchRequestSchema),
    defaultValues: {
      refCode: "",
    },
  });

  const onSubmit = (data: SearchRequest) => {
    const trimmedRefCode = data.refCode.trim();
    if (trimmedRefCode) {
      setLocation(`/receipt/${encodeURIComponent(trimmedRefCode)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Receipt className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ระบบสืบค้นใบเสร็จรับเงิน
            </h1>
            <p className="text-muted-foreground">
              โปรดระบุหมายเลขอ้างอิงเอกสารเพื่อดำเนินการสืบค้นใบเสร็จ
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="refCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หมายเลขอ้างอิงเอกสาร</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ตัวอย่าง: INV-2025-0010"
                        {...field}
                        data-testid="input-refcode"
                        className="font-mono text-center"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                data-testid="button-search"
              >
                <Search className="w-4 h-4 mr-2" />
                สืบค้นใบเสร็จรับเงิน
              </Button>
            </form>
          </Form>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="font-medium text-foreground mb-2 text-center">ตัวอย่างหมายเลขอ้างอิงเอกสาร:</h3>
            <div className="text-sm text-muted-foreground space-y-1 text-center">
              <div>• INV-2025-0010</div>
              <div>• INV-2025-0011</div>
              <div>• REC-2025-0001</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
