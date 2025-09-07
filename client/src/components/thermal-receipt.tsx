import { type ReceiptData } from "@shared/schema";
import PDF417Barcode from "./pdf417-barcode";

interface ThermalReceiptProps {
  data: ReceiptData;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function calculateTotals(items: ReceiptData['items']) {
  let subtotal = 0;
  let totalWithholding = 0;

  items.forEach(item => {
    const itemTotal = item.Amount * item.Price;
    subtotal += itemTotal;
    totalWithholding += item.WithholdingTax || 0;
  });

  const grandTotal = subtotal - totalWithholding;

  return {
    subtotal,
    totalWithholding,
    grandTotal
  };
}

export default function ThermalReceipt({ data }: ThermalReceiptProps) {
  const { info, items } = data;
  const totals = calculateTotals(items);

  return (
    <div className="receipt-container bg-white mx-auto max-w-md border-2 border-gray-400 shadow-xl rounded-lg overflow-hidden">
      <div className="thermal-receipt p-4 text-xs font-mono">
        {/* Receipt Header */}
        <div className="text-center mb-4 border-b border-dashed border-gray-400 pb-3">
          <div className="text-lg font-bold mb-2" data-testid="text-seller-name">
            {info.NameSeller}
          </div>
          <div className="mb-1" data-testid="text-seller-address">{info.SellerAddress}</div>
          <div data-testid="text-seller-taxid">
            เลขประจำตัวผู้เสียภาษี: {info.SellerTaxId}
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Receipt Info */}
        <div className="mb-4 text-center">
          <div className="text-base font-bold mb-2">ใบเสร็จรับเงิน</div>
          <div className="receipt-item mb-1">
            <span>หมายเลขอ้างอิง:</span>
            <span className="font-bold" data-testid="text-ref-code">{info.RefCodeInfoItem}</span>
          </div>
          <div className="receipt-item">
            <span>วันที่ออกใบเสร็จ:</span>
            <span data-testid="text-create-date">{formatDate(info.CreateDate)}</span>
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Buyer Info */}
        <div className="mb-4 border-b border-dashed border-gray-400 pb-3">
          <div className="font-bold mb-2 text-center">ข้อมูลผู้ชำระเงิน</div>
          <div className="text-center mb-1">
            <div className="font-semibold" data-testid="text-buyer-name">{info.BuyerName}</div>
          </div>
          <div className="text-center mb-1" data-testid="text-buyer-address">{info.BuyerAddress}</div>
          <div className="text-center mb-1" data-testid="text-buyer-taxid">
            เลขประจำตัวผู้เสียภาษี: {info.BuyerTaxId} 
            <span className="block">({info.BuyerOrgType})</span>
          </div>
        </div>

        <div className="dotted-line"></div>

        <div className="mb-4">
          <div className="text-center font-bold mb-3">รายการสินค้า/บริการ</div>
          <div className="receipt-item font-bold mb-2 border-b border-gray-300">
            <span>รายการ</span>
            <span className="text-right">มูลค่า (บาท)</span>
          </div>

          {items.map((item, index) => (
            <div key={item.ID} data-testid={`item-${index}`}>
              <div className="receipt-item">
                <span data-testid={`item-name-${index}`}>
                  {item.Item} ×{item.Amount}@{formatCurrency(item.Price)}
                </span>
                <span className="text-right" data-testid={`item-total-${index}`}>
                  {formatCurrency(item.Amount * item.Price)}
                </span>
                
              </div>
              {item.WithholdingTax > 0 && (
                <div className="receipt-item text-xs text-red-600">
                  <span></span>
                  <span></span>
                  <span className="text-right" data-testid={`item-withholding-${index}`}>
                    หักภาษี ณ ที่จ่าย: -{formatCurrency(item.WithholdingTax)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="dotted-line"></div>

        {/* Totals */}
        <div className="mb-4 border-t border-dashed border-gray-400 pt-3">
          <div className="receipt-item mb-1">
            <span>มูลค่าสินค้า/บริการรวม:</span>
            <span data-testid="text-subtotal">
              {formatCurrency(totals.subtotal)} บาท
            </span>
          </div>
          <div className="receipt-item mb-1 text-red-600">
            <span>หักภาษี ณ ที่จ่าย:</span>
            <span data-testid="text-total-withholding">
              -{formatCurrency(totals.totalWithholding)} บาท
            </span>
          </div>
          <div className="receipt-item font-bold text-lg border-t border-gray-300 pt-2 mt-2">
            <span>จำนวนเงินสุทธิ:</span>
            <span data-testid="text-grand-total">
              {formatCurrency(totals.grandTotal)} บาท
            </span>
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Signature Section */}
        <div className="mb-4 border-t border-dashed border-gray-400 pt-4">
          <div className="text-center mb-4">
            <div className="mb-3 text-sm font-semibold">ลงลายมือชื่อผู้รับเงิน</div>
            <div className="mx-6 mb-3 relative">
              <div className="border-b-2 border-gray-500" style={{height: '50px'}}></div>
            </div>
            <div className="text-xs font-medium mb-2">
              ผู้รับมอบอำนาจ/ผู้มีอำนาจลงนาม
            </div>
            <div className="text-xs text-gray-600 mt-1">
              วันที่ {formatDate(info.CreateDate)}
            </div>
          </div>
        </div>

        {/* Barcode */}
        <div className="text-center mb-3">
          <PDF417Barcode 
            data={`${info.RefCodeInfoItem}|${formatDate(info.CreateDate)}|${info.SellerTaxId}|${info.BuyerTaxId}|${formatCurrency(totals.subtotal)}|${formatCurrency(totals.totalWithholding)}|${formatCurrency(totals.grandTotal)}`}
            width={250}
            height={80}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-xs border-t border-dashed border-gray-400 pt-3">
          <div className="mb-2 font-semibold">ขอบพระคุณที่ใช้บริการ</div>
          <div className="mb-1">*** ใบเสร็จรับเงิน ***</div>
          <div data-testid="text-update-date">
            ปรับปรุงข้อมูลล่าสุด: {formatDate(info.UpdateDate)}
          </div>
        </div>
      </div>
    </div>
  );
}