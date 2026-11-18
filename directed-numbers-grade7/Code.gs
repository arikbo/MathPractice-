const SHEET_NAME='ציונים';
function doPost(e){
  const lock=LockService.getScriptLock();
  try{
    lock.waitLock(10000);
    const d=JSON.parse(e.postData.contents||'{}');
    const name=String(d.name||'').trim().slice(0,60);
    const cls=String(d.studentClass||'').trim().slice(0,12);
    const a=Number(d.additionScore),b=Number(d.subtractionScore),total=Number(d.totalScore);
    if(!name||!cls||![a,b,total].every(Number.isInteger)||a<0||a>6||b<0||b>6||total!==a+b)throw Error('Invalid submission');
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    let sh=ss.getSheetByName(SHEET_NAME);
    if(!sh)sh=ss.insertSheet(SHEET_NAME);
    if(sh.getLastRow()===0)sh.appendRow(['תאריך','שם תלמיד','כיתה','חיבור מתוך 6','חיסור מתוך 6','ציון כולל מתוך 12','אחוז']);
    const safe=s=>/^[=+\-@\t\r]/.test(s)?"'"+s:s;
    sh.appendRow([new Date(),safe(name),safe(cls),a,b,total,Math.round(total/12*100)]);
    return ContentService.createTextOutput('OK');
  }catch(err){
    console.error(err);
    return ContentService.createTextOutput('ERROR');
  }finally{try{lock.releaseLock()}catch(_){}}
}