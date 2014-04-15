/*
UseCase: downloadCSV
Pre UseCases: in edit mode

Procedure:

•The user clicks the download csv button on the form
•The system converts option list to a csv file and downloads to user
Post Conditions: none*/

describe('download csv', function()
{
	it('should be logged in as an admin');
	it('form should be in edit mode');
	it('should wait for download button to be clicked');
	it('should convert option list to csv file');
	it('should download csv file to user computer');
	it('should not allow empty list to download to be downloaded');
}
);