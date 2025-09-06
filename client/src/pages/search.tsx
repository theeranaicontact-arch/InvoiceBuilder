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
              ระบบค้นหาใบเสร็จรับเงิน
            </h1>
            <p className="text-muted-foreground">
              กรอกเลขที่เอกสารเพื่อค้นหาใบเสร็จ
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="refCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เลขที่เอกสาร (RefCodeInfoItem)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="เช่น INV-2025-0010"
                        {...field}
                        data-testid="input-refcode"
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                data-testid="button-search"
              >
                <Search className="w-4 h-4 mr-2" />
                ค้นหาใบเสร็จ
              </Button>
            </form>
          </Form>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="font-medium text-foreground mb-2">ตัวอย่างเลขที่เอกสาร:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• INV-2025-0010</li>
              <li>• INV-2025-0011</li>
              <li>• REC-2025-0001</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
