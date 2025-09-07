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
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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
    <div className="receipt-container bg-white mx-auto max-w-lg border border-gray-200 shadow-2xl rounded-xl overflow-hidden">
      <div className="thermal-receipt p-6 text-sm font-sans">
        {/* Receipt Header */}
        <div className="text-center mb-6 pb-4">
          <div className="text-xl font-bold mb-3 text-gray-800" data-testid="text-seller-name">
            {info.NameSeller}
          </div>
          <div className="mb-2 text-gray-600" data-testid="text-seller-address">{info.SellerAddress}</div>
          <div className="text-sm text-gray-500" data-testid="text-seller-taxid">
            เลขประจำตัวผู้เสียภาษี: {info.SellerTaxId}
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Receipt Info */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-lg font-bold mb-3 text-center text-blue-700">ใบเสร็จรับเงิน</div>
          <div className="receipt-item mb-2">
            <span className="font-medium">หมายเลขอ้างอิง:</span>
            <span className="font-bold text-blue-600" data-testid="text-ref-code">{info.RefCodeInfoItem}</span>
          </div>
          <div className="receipt-item">
            <span className="font-medium">วันที่ออกใบเสร็จ:</span>
            <span data-testid="text-create-date">{formatDate(info.CreateDate)}</span>
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Buyer Info */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <div className="font-bold mb-3 text-center text-blue-700">ข้อมูลผู้ชำระเงิน</div>
          <div className="text-center mb-2">
            <div className="font-semibold text-lg" data-testid="text-buyer-name">{info.BuyerName}</div>
          </div>
          <div className="text-center mb-2 text-gray-600" data-testid="text-buyer-address">{info.BuyerAddress}</div>
          <div className="text-center text-sm text-gray-500" data-testid="text-buyer-taxid">
            เลขประจำตัวผู้เสียภาษี: {info.BuyerTaxId} ({info.BuyerOrgType})
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Items List */}
        <div className="mb-6">
          <div className="text-center font-bold mb-4 text-green-700 text-lg">รายการสินค้า/บริการ</div>
          <div className="receipt-item font-bold mb-3 pb-2 border-b-2 border-green-600 text-green-700">
            <span>รายการ</span>
            <span style={{textAlign: 'center', flex: '0 0 60px'}}>จำนวน</span>
            <span className="text-right">มูลค่า (บาท)</span>
          </div>
          
          {items.map((item, index) => (
            <div key={item.ID} data-testid={`item-${index}`}>
              <div className="receipt-item">
                <span data-testid={`item-name-${index}`}>{item.Item}</span>
                <span style={{textAlign: 'center', flex: '0 0 60px'}} data-testid={`item-amount-${index}`}>
                  {item.Amount}
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
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <div className="receipt-item mb-2">
            <span className="font-medium">มูลค่าสินค้า/บริการรวม:</span>
            <span className="font-semibold" data-testid="text-subtotal">
              {formatCurrency(totals.subtotal)} บาท
            </span>
          </div>
          <div className="receipt-item mb-3 text-red-600">
            <span className="font-medium">หักภาษี ณ ที่จ่าย:</span>
            <span className="font-semibold" data-testid="text-total-withholding">
              -{formatCurrency(totals.totalWithholding)} บาท
            </span>
          </div>
          <div className="receipt-item font-bold text-xl bg-green-600 text-white p-3 rounded-lg">
            <span>จำนวนเงินสุทธิ:</span>
            <span data-testid="text-grand-total">
              {formatCurrency(totals.grandTotal)} บาท
            </span>
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Barcode */}
        <div className="text-center mb-6 bg-gray-100 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2 font-medium">รหัสอ้างอิงใบเสร็จ</div>
          <PDF417Barcode 
            data={`${info.RefCodeInfoItem}|${info.BuyerTaxId}|${totals.grandTotal}`}
            width={280}
            height={90}
          />
        </div>

        {/* Footer */}
        <div className="text-center bg-gray-800 text-white p-4 rounded-lg">
          <div className="mb-2 text-lg font-semibold">ขอบพระคุณที่ใช้บริการ</div>
          <div className="mb-2 text-yellow-300 font-bold">*** ใบเสร็จรับเงิน ***</div>
          <div className="text-sm text-gray-300" data-testid="text-update-date">
            ปรับปรุงข้อมูลล่าสุด: {formatDate(info.UpdateDate)}
          </div>
        </div>
      </div>
    </div>
  );
}
