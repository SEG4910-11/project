/*
UseCase: uploadCSV
Pre UseCases: in edit mode

Procedure:

•The user clicks the upload csv button on the form
•The system allows user to browse for file
•The user uploads file
•The system reads csv file and udpates option list
Post Conditions: none
*/

describe('upload csv', function()
{
	it('should be logged in as an admin');
	it('form should be in edit mode');
	it('should wait for upload button to be clicked');
	it('should allow user to browse for csv file');
	it('should not allow non-csv file to be chosen');
	it('should read csv and update option list accordingly');
}
);