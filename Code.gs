function SyncToMaster() {
  var masterID = "1N_GF4XUwcAd-vFenUZignAkcR9BOz4dTT5_OMjpe8Rk";          // Set Master SpreadSheet's ID here
  
  var masterSheetToSync = "Sheet1";                                       // Set name of sheet/tab in master
  var sheetToSync = "Sheet1";                                             // Set name of sheet/tab in reviewer sheet
  
  var rangeString = "A3:F";                                               // Set A1 notation range for data as string

  
  
  
    
  var masterSS = SpreadsheetApp.openById(masterID);
  var masterSheet = masterSS.getSheetByName(masterSheetToSync);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetToSync);
  var range = sheet.getRange(rangeString);
  var sheetData = range.getValues();
  
  var rowOffset = Number(rangeString[1]);
  
  var ui = SpreadsheetApp.getUi();
  
  var syncTime = "Synced " + getTime();
  //Cycle through reviewer sheet data and check if data in reviewer column, if it is: sync that row
  for (var row in sheetData) {
    if(sheetData[row][3] !== "" && sheetData[row][5] == "") { // Check each row to see if there's data in reviewer column and nothing in the status column
      var toWrite = [[sheetData[row][3], sheetData[row][4], syncTime]];
       if (masterSheet.getRange(Number(row)+rowOffset, 6).getValue() == "") {  // Check if row already synced in master sheet
         masterSheet.getRange(Number(row)+rowOffset, 4, 1, 3).setValues(toWrite);
         sheet.getRange(Number(row)+rowOffset, 6, 1, 1).setValue(syncTime);
         Logger.log("Data " + syncTime);
      }else{
        Logger.log("Already there"); //Set this up so it notifies the user
        ui.alert(sheetData[row][2] + ' is already in the master sheet as reviewed by ' + masterSheet.getRange(Number(row)+rowOffset, 4).getValue() + ' on ' + masterSheet.getRange(Number(row)+rowOffset, 5).getValue() + '. It has not been synced.');
        sheet.getRange(Number(row)+rowOffset, 6, 1, 1).setValue("Failed to Sync. Already in master");
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