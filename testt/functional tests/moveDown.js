/*

UseCase: Sort option: move down
Pre UseCases: EditForm

Procedure:

•The user clicks on the up or down buttons beside each option to move the option Up or Down respectively
•The system saves the order of the option
Post Conditions: SaveEdit, CancelEdit

*/

describe('sort option: move down', function()
{
	it('should be logged in as an admin');
	it('form should be in edit mode');
	it('should wait for user to click down arrow to add new option');
	it('should not allow first option to be moved down');
	it('should not allow last option to be moved down');
	it('should display new position when clicked');
}
);
