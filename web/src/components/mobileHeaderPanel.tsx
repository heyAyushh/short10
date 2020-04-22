import * as React from 'react';
import { DefaultButton, Stack, ActionButton, IconButton } from 'office-ui-fabric-react';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { useConstCallback } from '@uifabric/react-hooks';
import FeedbackDialog from './feedbackDialog';
import Logo from './logo/logo';

const itemStyles = {
	alignItems: 'center',
	display: 'flex',
	justifyContent: 'center'
};
const navStyles = {
	selectors: {
		':hover': {
			backgroundColor: 'blue'
		},
		'.parent &': {
			/* parent selector */
		},
		'& .child': {
			/* child selector */
		}
	},
	alignItems: 'center',
	display: 'flex',
	justifyContent: 'center'
};

const report = { iconName: 'ReportHacked' };
const menu = { iconName: 'ContextMenu' };

const viewAll = { iconName: 'ViewAll' };
const logOut = { iconName: 'SignOut' };

export const MobileHeaderPanel: React.FunctionComponent = (props: any) => {
	const [ isOpen, setIsOpen ] = React.useState(false);

	const openPanel = useConstCallback(() => setIsOpen(true));
	const dismissPanel = useConstCallback(() => setIsOpen(false));

	return (
		<div>
			<Stack horizontal horizontalAlign="start">
				<IconButton iconProps={menu} onClick={openPanel} styles={{root:{height:60, width:60, marginRight:60 }}}/>

				<Stack horizontal horizontalAlign="center">
					<Logo theme={props.theme} />
				</Stack>
			</Stack>
			<Panel
				isLightDismiss
				isOpen={isOpen}
				onDismiss={dismissPanel}
				closeButtonAriaLabel="Close"
				headerText="Menu"
			>
				<span style={navStyles}>
					<Stack verticalAlign="center">
						<span style={navStyles}>
							{/* 							<ActionButton iconProps={viewAll} allowDisabledFocus>
								All Links
							</ActionButton> */}
						</span>
						<span style={navStyles}>
							<FeedbackDialog />
						</span>
						<span style={navStyles}>
							{/* <ReportPanel/> */}
							<ActionButton
								iconProps={report}
								allowDisabledFocus
								text="Report"
								href={process.env.REACT_APP_reportForm}
							/>
						</span>
					</Stack>
				</span>
				<span style={itemStyles}>
					<Stack verticalAlign="center" verticalFill={true}>
						<span style={itemStyles}>
							<ActionButton iconProps={logOut} allowDisabledFocus href={process.env.REACT_APP_SIGN_OUT_URL}>
								Sign Out
							</ActionButton>
						</span>
					</Stack>
				</span>
			</Panel>
		</div>
	);
};
