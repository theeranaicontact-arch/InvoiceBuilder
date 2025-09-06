import { type ReceiptData } from "@shared/schema";

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
    <div className="receipt-container bg-white mx-auto max-w-sm border-2 border-gray-300 shadow-lg">
      <div className="thermal-receipt p-4 text-xs font-mono">
        {/* Receipt Header */}
        <div className="text-center mb-3">
          <div className="text-sm font-bold" data-testid="text-seller-name">
            {info.NameSeller}
          </div>
          <div data-testid="text-seller-address">{info.SellerAddress}</div>
          <div data-testid="text-seller-taxid">
            เลขประจำตัวผู้เสียภาษี: {info.SellerTaxId}
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Receipt Info */}
        <div className="mb-3">
          <div className="receipt-item">
            <span>เลขที่:</span>
            <span data-testid="text-ref-code">{info.RefCodeInfoItem}</span>
          </div>
          <div className="receipt-item">
            <span>วันที่:</span>
            <span data-testid="text-create-date">{formatDate(info.CreateDate)}</span>
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Buyer Info */}
        <div className="mb-3">
          <div className="font-bold mb-1">ลูกค้า:</div>
          <div data-testid="text-buyer-name">{info.BuyerName}</div>
          <div data-testid="text-buyer-address">{info.BuyerAddress}</div>
          <div data-testid="text-buyer-taxid">
            เลขประจำตัวผู้เสียภาษี: {info.BuyerTaxId}
          </div>
          <div data-testid="text-buyer-org-type">
            ประเภท: {info.BuyerOrgType}
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Items List */}
        <div>
          <div className="receipt-item font-bold mb-2">
            <span>รายการ</span>
            <span className="text-center">จน.</span>
            <span className="text-right">ราคา</span>
          </div>
          
          {items.map((item, index) => (
            <div key={item.ID} data-testid={`item-${index}`}>
              <div className="receipt-item">
                <span data-testid={`item-name-${index}`}>{item.Item}</span>
                <span className="text-center" data-testid={`item-amount-${index}`}>
                  {item.Amount}
                </span>
                <span className="text-right" data-testid={`item-total-${index}`}>
                  {formatCurrency(item.Amount * item.Price)}
                </span>
              </div>
              {item.WithholdingTax > 0 && (
                <div className="receipt-item text-xs text-gray-600">
                  <span></span>
                  <span></span>
                  <span className="text-right" data-testid={`item-withholding-${index}`}>
                    หัก ณ ที่จ่าย: -{formatCurrency(item.WithholdingTax)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="dotted-line"></div>

        {/* Totals */}
        <div className="mb-3">
          <div className="receipt-item">
            <span>รวมเงิน:</span>
            <span data-testid="text-subtotal">
              {formatCurrency(totals.subtotal)} บาท
            </span>
          </div>
          <div className="receipt-item">
            <span>หัก ณ ที่จ่าย:</span>
            <span data-testid="text-total-withholding">
              -{formatCurrency(totals.totalWithholding)} บาท
            </span>
          </div>
          <div className="receipt-item font-bold text-sm">
            <span>ยอดชำระ:</span>
            <span data-testid="text-grand-total">
              {formatCurrency(totals.grandTotal)} บาท
            </span>
          </div>
        </div>

        <div className="dotted-line"></div>

        {/* Footer */}
        <div className="text-center text-xs">
          <div>ขอบคุณที่ใช้บริการ</div>
          <div className="mt-2" data-testid="text-update-date">
            อัพเดตล่าสุด: {formatDate(info.UpdateDate)}
          </div>
        </div>
      </div>
    </div>
  );
}
