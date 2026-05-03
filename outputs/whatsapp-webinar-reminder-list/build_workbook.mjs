import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outDir = "/Users/abc/Herd/husnihalim-website/outputs/whatsapp-webinar-reminder-list";
const csvPath = `${outDir}/whatsapp_webinar_reminder_list.csv`;
const xlsxPath = `${outDir}/whatsapp_webinar_reminder_list.xlsx`;

const csvText = await fs.readFile(csvPath, "utf8");
const workbook = await Workbook.fromCSV(csvText, { sheetName: "Reminder List" });

const sheet = workbook.worksheets.getItem("Reminder List");
sheet.getRange("A1:I1").format.fill.color = "#0F5BA7";
sheet.getRange("A1:I1").format.font.color = "#FFFFFF";
sheet.getRange("A1:I1").format.font.bold = true;
sheet.getRange("A:I").format.font.name = "Aptos";
sheet.getRange("A:I").format.font.size = 11;
sheet.getRange("A:A").format.columnWidthPx = 48;
sheet.getRange("B:B").format.columnWidthPx = 245;
sheet.getRange("C:C").format.columnWidthPx = 145;
sheet.getRange("D:D").format.columnWidthPx = 125;
sheet.getRange("E:E").format.columnWidthPx = 150;
sheet.getRange("F:F").format.columnWidthPx = 220;
sheet.getRange("G:G").format.columnWidthPx = 145;
sheet.getRange("H:H").format.columnWidthPx = 150;
sheet.getRange("I:I").format.columnWidthPx = 150;
sheet.freezePanes.freezeRows(1);

const summary = workbook.worksheets.add("Summary");
summary.getRange("A1").values = [["WhatsApp Webinar Reminder List"]];
summary.getRange("A1").format.font.bold = true;
summary.getRange("A1").format.font.size = 16;
summary.getRange("A3:B7").values = [
  ["Total contacts", 51],
  ["Source chat", "Kaizen Champion Prog"],
  ["Source item", "51-contact card"],
  ["Source message date", "2026-04-27 11:39"],
  ["Use", "Broadcast/reminder tracking"],
];
summary.getRange("A3:A7").format.font.bold = true;
summary.getRange("A:A").format.columnWidthPx = 170;
summary.getRange("B:B").format.columnWidthPx = 260;

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 20 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

await workbook.render({ sheetName: "Reminder List", range: "A1:I20", scale: 1 });
await workbook.render({ sheetName: "Summary", range: "A1:B8", scale: 1 });

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(xlsxPath);
console.log(xlsxPath);
