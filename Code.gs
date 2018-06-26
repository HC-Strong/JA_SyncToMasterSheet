// Script written by Hannah Strong <stronghannahc@gmail.com> for James Atkins, June 2018
// Last edited: June 25, 2018

function SyncToMaster() {
  //var masterID = "1jdAuo58m69FpKypTRg6LNTLZZ13qXxEU8va-oj998RU";          // Set Master SpreadSheet's ID here
  var masterID = "1qzYhJjRyb9f-iLJVk3Rb6FZOhneeuIdD6lpWVPvpMaw";          // Set testing master sheet ID here and comment out this or the above
  
  var masterSheetToSync = "Sheet1";                                       // Set name of sheet/tab in master
  var sheetToSync = "Sheet1";                                             // Set name of sheet/tab in reviewer sheet
  
  var rangeString = "A3:F";                                               // Set A1 notation range for data as string

  
  
  var masterSS = SpreadsheetApp.openById(masterID);
  var masterSheet = masterSS.getSheetByName(masterSheetToSync);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetToSync);
  var range = sheet.getRange(rangeString);
  var sheetData = range.getValues();
  
  var dataStartRow = Number(rangeString[1]);
  var brandCol = 1;
  var revCol = 2;
  var revDateCol = 3;
  var statusCol = 4;
  
  
  var ui = SpreadsheetApp.getUi();
  
  var syncTime = "Synced " + getTime();
  //Cycle through reviewer sheet data and check if data in reviewer column, if it is: sync that row
  for (var row in sheetData) {
    if(sheetData[row][revCol-1] !== "" && sheetData[row][statusCol-1] == "") { // Check each row to see if there's data in reviewer column and nothing in the status column

       if (masterSheet.getRange(Number(row)+dataStartRow, statusCol).getValue() == "") {  // Check if row already synced in master sheet
         var toWrite = [[sheetData[row][revCol-1], sheetData[row][revDateCol-1], syncTime]];
         masterSheet.getRange(Number(row)+dataStartRow, revCol, 1, 3).setValues(toWrite);
         sheet.getRange(Number(row)+dataStartRow, statusCol, 1, 1).setValue(syncTime);
         Logger.log("Data " + syncTime);
      }else{
        Logger.log("Already there"); //Set this up so it notifies the user
        ui.alert(sheetData[row][brandCol-1] + ' was already reviewed on ' + Utilities.formatDate(masterSheet.getRange(Number(row)+dataStartRow, revDateCol).getValue(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'MM/dd/yy') + ' so it has not been synced.');
        sheet.getRange(Number(row)+dataStartRow, statusCol, 1, 1).setValue("Failed to Sync. Already in master");
      }
    }else{
     //Logger.log("n/a"); 
    }
  }
}

function getTime(){
  var curDateRaw = new Date();
  var curDate = Utilities.formatDate(curDateRaw, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'MM/dd/yy @ h:mm a');
  
  return curDate;
}














