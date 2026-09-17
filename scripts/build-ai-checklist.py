from pathlib import Path
import json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.utils import ImageReader
from xml.sax.saxutils import escape

root = Path(__file__).resolve().parent.parent
data = json.loads((root / 'src/data/aiChecklist.json').read_text(encoding='utf-8'))
out = root / 'public/downloads/restoration-ai-visibility-checklist.pdf'
out.parent.mkdir(exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BrandTitle', fontName='Helvetica-Bold', fontSize=26, leading=30, textColor=HexColor('#071a42'), spaceAfter=14))
styles.add(ParagraphStyle(name='SectionTitle', fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=HexColor('#0b4aa2'), spaceBefore=16, spaceAfter=10))
styles.add(ParagraphStyle(name='Copy', fontName='Helvetica', fontSize=10.5, leading=15, textColor=HexColor('#42516a'), spaceAfter=10))
styles.add(ParagraphStyle(name='SmallCopy', fontName='Helvetica', fontSize=9, leading=12, textColor=HexColor('#42516a'), spaceAfter=7))
story = [Paragraph(data['title'],styles['BrandTitle']),Paragraph(data['intro'],styles['Copy'])]
for si,section in enumerate(data['sections']):
    if si == 2: story.append(PageBreak())
    story.append(Paragraph(section['title'], styles['SectionTitle']))
    for item in section['items']:
        story.append(KeepTogether([Paragraph(escape(item), styles['Copy']), Paragraph('Done ____     Needs work ____     Not checked ____',styles['SmallCopy']),Spacer(1,6)]))
story.extend([Spacer(1,8),Paragraph(data['closing'],styles['Copy']),Paragraph('Choose your next step',styles['SectionTitle']),Paragraph('Bring your observations to a free, 30-minute Lead Flow Acceleration Session with Matt. We will discuss your priorities and whether the R&amp;R Restoration Growth System fits your market.',styles['Copy']),Paragraph('<link href="https://remediationrestorationmarketing.com/schedule/" color="#0b4aa2">Request your session at remediationrestorationmarketing.com/schedule/</link>',styles['SmallCopy'])])
for source in data['sources']:
    story.append(Paragraph(f'<link href="{escape(source["url"])}" color="#0b4aa2">{escape(source["title"])}</link>',styles['SmallCopy']))
def furniture(canvas,doc):
    canvas.setStrokeColor(HexColor('#acb9ca')); canvas.line(48,42,564,42)
    canvas.setFont('Helvetica',8); canvas.setFillColor(HexColor('#42516a'))
    canvas.drawString(48,28,'Remediation & Restoration Marketing  |  Reviewed '+data['reviewed'])
    canvas.drawRightString(564,28,f'{doc.page}')
SimpleDocTemplate(str(out),pagesize=(612,792),leftMargin=48,rightMargin=48,topMargin=42,bottomMargin=55,title=data['title'],author='Remediation & Restoration Marketing').build(story,onFirstPage=furniture,onLaterPages=furniture)
print(out)
