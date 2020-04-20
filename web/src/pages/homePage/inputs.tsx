import * as React from 'react';
import { TextField, ITextFieldStyles, CompoundButton } from 'office-ui-fabric-react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

export interface ITextFieldControlledExampleState {
	value1: any;
	value2: string;
  valid: boolean;
  ready: boolean;
}

const addIcon = { iconName: 'AddLink' };

interface IProps {
  sendData?: Function;
}

export class Inputs extends React.Component<IProps, ITextFieldControlledExampleState> {
  public state: ITextFieldControlledExampleState = { value1: '', value2: '', valid: false, ready: false };

  constructor(props :IProps) {
    super(props);
    this.demoMethod = this.demoMethod.bind(this);
  }


  fetchClipBoard(){
    navigator.clipboard.readText().then(
      clipText => this.setState({ value1: clipText }));
  }

  componentDidMount(){
    this.fetchClipBoard();
  }

  demoMethod(){
    console.log(this.props);
    //@ts-ignore
    this.props.sendData(this.state);
  }

	public render() {
		return (
			<Stack tokens={{ childrenGap: 40 }}>
				<TextField
					label="Enter URL here"
					key={'longurl'}
					placeholder="Paste your loooong Url here"
					required={true}
					onGetErrorMessage={this._getErrorMessage}
					deferredValidationTime={300}
					value={this.state.value1}
					onChange={this._onChange1}
					styles={{ fieldGroup: { width: '100%', height: 70, padding:20 } }}
				/>

				<TextField
					label="Custom Url"
					key={'customUrl'}
          			placeholder="Custom link? Your choice"
          			autoFocus={true}
					prefix="https://bymsp.com/"
					value={this.state.value2}
					onChange={this._onChange2}
					styles={{ fieldGroup: { width: '100%', textHeight: "70", height: 70 } }}
				/>

				<Stack horizontal horizontalAlign="end">
					<CompoundButton primary iconProps={addIcon} secondaryText="Let's have your link generated" onClick={this.demoMethod}>
						Short10
					</CompoundButton>
				</Stack>
			</Stack>
		);
	}

	private _onChange1 = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		this.setState({ value1: newValue || '' });
	};

	private _getErrorMessage = (value: string): string => {
    var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(value);
    
    this.setState({valid: valid?.valueOf()})
		return valid || value.length < 1 ? '' : `Input should be a URL.`;
	};

	private _onChange2 = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		this.setState({ value2: newValue || ''});
	};
}
