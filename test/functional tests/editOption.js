/*
UseCase: Edit option
Pre UseCases: EditForm

Procedure:

•The user edits the option in the text field
•The system saves the change once the text field is not highlighted
Post Conditions: SaveEdit, CancelEdit

*/


describe('edit option', function()
{
	it('should be logged in as an admin');
	it('form should be in edit mode');
	it('should wait for user to click specific option and open option edit page');
	it('should not allow empty text field as edited option text');
	it('should display edited field with new text');
}
);