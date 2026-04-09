import matplotlib.pyplot as plt
from reportlab.pdfgen import canvas as pdf_canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
import psycopg2
import io
import datetime
import os

def connect():
    return psycopg2.connect(
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_NAME", "web2_db"),
    )

def generate_pdf_report(db_connection, user_id):
    cur = db_connection.cursor()
    cur.execute( "SELECT status, COUNT(*) FROM concrete_board WHERE user_id = %s GROUP BY status", (user_id,),)
    data = cur.fetchall()
    
    statuses = [row[0] for row in data]
    counts = [row[1] for row in data]

    plt.figure(figsize=(8, 6), dpi=300) 
    plt.bar(statuses, counts, color=['#ff9999','#66b3ff','#99ff99'])
    plt.title(f"Statistics for User {user_id}")
    
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    plt.close()

    file_path = f"report_{user_id}_{datetime.date.today()}.pdf"
    canvas = pdf_canvas.Canvas(file_path, pagesize=A4)
    
    canvas.setFont("Helvetica-Bold", 20)
    canvas.drawString(100, 800, "Statistics Report")
    
    canvas.setFont("Helvetica", 12)
    canvas.drawString(100, 780, f"Generated on: {datetime.datetime.now()}")

    img_reader = ImageReader(img_buffer)
    canvas.drawImage(img_reader, 50, 400, width=500, height=350)

    canvas.save()
    return file_path

def main():
    db_connection = connect()
    user_id = 1
    try:
        file_path = generate_pdf_report(db_connection, user_id)
        print(f"Report generated: {file_path}")
    finally:
        db_connection.close()

if __name__ == "__main__":
    main()
