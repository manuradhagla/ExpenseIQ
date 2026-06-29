import csv
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def generate_csv(expenses):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Title", "Category", "Amount", "Payment Mode", "Note"])
    for expense in expenses:
        spent_on = expense.get("spent_on", "")
        if hasattr(spent_on, "isoformat"):
            spent_on = spent_on.isoformat()
        writer.writerow(
            [
                spent_on,
                expense.get("title", ""),
                expense.get("category", ""),
                f"{float(expense.get('amount', 0)):.2f}",
                expense.get("payment_mode", ""),
                expense.get("note") or "",
            ]
        )
    return output.getvalue()


def generate_pdf(expenses, month):
    output = io.BytesIO()
    pdf = canvas.Canvas(output, pagesize=letter)
    pdf.setTitle(f"ExpenseIQ Monthly Report {month}")
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(40, 760, f"ExpenseIQ Monthly Report - {month}")
    pdf.setFont("Helvetica", 10)

    y = 730
    total = 0
    for exp in expenses:
        line = f"{exp.get('spent_on')} | {exp.get('title')} | {exp.get('category')} | {float(exp.get('amount', 0)):.2f}"
        pdf.drawString(40, y, line[:110])
        total += float(exp.get("amount", 0))
        y -= 18
        if y <= 60:
            pdf.showPage()
            y = 760

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(40, y - 10, f"Total Expense: {total:.2f}")
    pdf.save()
    output.seek(0)
    return output.read()
