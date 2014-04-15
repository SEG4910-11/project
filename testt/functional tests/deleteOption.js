/*
UseCase: Delete option
Pre UseCases: EditForm

Procedure:

•The user click on the "x" next to the option they wish to delete
•The system removes the option from the menu list
Post Conditions: SaveEdit, CancelEdit

*/
describe('delete option', function()
{
	it('should be logged in as an admin');
	it('form should be in edit mode');
	it('should wait for user to click minus sign to add new option');
	it('should not allow first option to be deleted');
	it('should remove selected option from display');
);