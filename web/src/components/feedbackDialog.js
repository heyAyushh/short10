import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib-commonjs/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib-commonjs/Button';
import { getId } from 'office-ui-fabric-react/lib-commonjs/Utilities';
import { hiddenContentStyle, mergeStyles } from 'office-ui-fabric-react/lib-commonjs/Styling';
import { Checkbox } from 'office-ui-fabric-react/lib-commonjs/Checkbox';
import { ContextualMenu } from 'office-ui-fabric-react/lib-commonjs/ContextualMenu';
import { useState } from 'react';
import { ActionButton, IIconProps } from 'office-ui-fabric-react';
import React from 'react';

const feedback = { iconName: 'Feedback' };

const screenReaderOnly = mergeStyles(hiddenContentStyle);

export default () => {
	const [ state, setState ] = useState({
		hideDialog: true,
		isDraggable: false
	});

	const _labelId = getId('dialogLabel'),
		_subTextId = getId('subTextLabel'),
		_dragOptions = {
			moveMenuItemText: 'Move',
			closeMenuItemText: 'Close',
			menu: ContextualMenu
		};

	const _showDialog = () => {
		setState({ hideDialog: false });
	};

	const _closeDialog = () => {
		setState({ hideDialog: true });
	};

	return (
		<div>
			<ActionButton iconProps={feedback} onClick={_showDialog} text="Feedback" allowDisabledFocus/>
			<label id={_labelId} className={screenReaderOnly}>
				My sample Label
			</label>
			<label id={_subTextId} className={screenReaderOnly}>
				My Sample description
			</label>

			<Dialog
				hidden={state.hideDialog}
				onDismiss={_closeDialog}
				dialogContentProps={{
					type: DialogType.normal,
					title: 'Send Feedback',
					closeButtonAriaLabel: 'Close',
					subText:
						"You'll be redirected to our Microsoft Teams thread to share feedback.  For submitting suggestions or Bugs you can submit an Issue on GitHub below."
				}}
				modalProps={{
					titleAriaId: _labelId,
					subtitleAriaId: _subTextId,
					isBlocking: false,
					styles: { main: { maxWidth: 450 } },
					dragOptions: state.isDraggable ? _dragOptions : undefined
				}}
			>
				<DialogFooter>
					<PrimaryButton href={process.env.REACT_APP_feedbackURL} text="Send" />
					<DefaultButton onClick={_closeDialog} text="Cancel" />
				</DialogFooter>
			</Dialog>
		</div>
	);
};
