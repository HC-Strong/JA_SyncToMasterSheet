// Script written by Hannah Strong <stronghannahc@gmail.com> for James Atkins, June 2018
// Last edited: June 25, 2018

function SyncToMaster() {
  //var masterID = "1jdAuo58m69FpKypTRg6LNTLZZ13qXxEU8va-oj998RU";          // Set Master SpreadSheet's ID here
  var masterID = "1qzYhJjRyb9f-iLJVk3Rb6FZOhneeuIdD6lpWVPvpMaw";          // Set testing master sheet ID here and comment out this or the above
  
  var masterSheetToSync = "Sheet1";                                       // Set name of sheet/tab in master
  var sheetToSync = "Sheet1";                                             // Set name of sheet/tab in reviewer sheet
  
  var rangeString = "A3:D";                                               // Set A1 notation range for data as string

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetToSync);
  var range = sheet.getRange(rangeString);
  var sheetData = range.getValues();
  
  var masterSS = SpreadsheetApp.openById(masterID);
  var masterSheet = masterSS.getSheetByName(masterSheetToSync);
  var masterRange = masterSheet.getRange(rangeString);
  var masterData = masterRange.getValues();
  
  var dataStartRow = Number(rangeString[1]);
  var brandCol = 1;
  var revCol = 2;
  var revDateCol = 3;
  var statusCol = 4;
  
  var ui = SpreadsheetApp.getUi();
  
  var syncTime = "Synced " + getTime();
  //Cycle through reviewer sheet data and check if data in reviewer column, if it is: sync that row
  for (var row in sheetData) {
    var curBrand = sheetData[row][brandCol-1];
    var curReviewer = sheetData[row][revCol-1];
    var curStatus = sheetData[row][statusCol-1];

    //Logger.log(curBrand + " (curBrand)");
    if(curReviewer !== "" && curStatus == "") { // Check each row to see if there's data in reviewer column and nothing in the status column
      var masterRow = Number(findMasterRow(curBrand, masterData));        // find row number for brand in master sheet. -1 means it's not there.
      
      if (masterRow > -1) {
        if (masterData[masterRow][revCol-1] == "") {   // Check if row not yet synced to master sheet and sync if not
          var toWrite = [[sheetData[row][revCol-1], sheetData[row][revDateCol-1], syncTime]];
          masterSheet.getRange(masterRow+dataStartRow, revCol, 1, 3).setValues(toWrite);
          sheet.getRange(Number(row)+dataStartRow, statusCol, 1, 1).setValue(syncTime);
          Logger.log("Data " + syncTime);
       }else{ // if row already synced, let the user know
         Logger.log("Already there");
         //ui.alert(sheetData[row][brandCol-1] + ' was already reviewed on ' + Utilities.formatDate(masterSheet.getRange(masterRow+dataStartRow, revDateCol).getValue(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'MM/dd/yy') + ' so it has not been synced.');
         sheet.getRange(Number(row)+dataStartRow, statusCol, 1, 1).setValue("Failed to Sync. Already in master");
       }
      } else {
        ui.alert("Review status for " + curBrand + " was not found in the master sheet so cannot be synced.");
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





function findMasterRow(brand, masterData) {
  for (var mRow in masterData) {
    if (masterData[mRow][0] == brand) {
     return mRow;
     break;
    }  
  }
  return -1;
}
