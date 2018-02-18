import React, { Component } from "react";
import {
	Col,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText
} from "reactstrap";

export default class WiFiSettings extends Component {
	render() {
		return (
			<div>
				<div
					style={{
						display: "flex",
						border: "5px auto",
						flexDirection: "column"
					}}>
					<TwoGigLogin />
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column"
					}}>
					<FiveGigLogin />
				</div>
			</div>
		);
	}
}

function TwoGigLogin() {
	return (
		<Form>
			<Label for="2.4-GHz-Form"> 2.4 GHz</Label>

			<FormGroup id="2.4-GHz-Form" row>
				<Label for="2.4-GHz-ssid-input" sm={2}>
					SSID
				</Label>
				<Col sm={5}>
					<Input
						type="text"
						name="2.4-GHz-ssid"
						id="2.4-GHz-ssid-input"
						placeholder="min. 8 characters"
					/>
				</Col>
			</FormGroup>

			<FormGroup row>
				<Label for="2.4-GHz-password-input" sm={2}>
					Email
				</Label>
				<Col sm={5}>
					<Input
						type="password"
						name="2.4-GHz-password"
						id="2.4-GHz-password-input"
						placeholder="min. 8 characters"
					/>
				</Col>
			</FormGroup>

			<FormGroup check>
				<Label check>
					<Input type="checkbox" />
					Connect to a mesh
				</Label>
			</FormGroup>

			<FormGroup>
				<Button>Submit</Button>
			</FormGroup>

			<FormGroup>
				<Button>Revert</Button>
			</FormGroup>
		</Form>
	);
}

function FiveGigLogin() {
	return (
		<Form>
			<Label for="5-GHz-Form"> 5 GHz</Label>

			<FormGroup id="5-GHz-Form" row>
				<Label for="5-GHz-ssid-input" sm={2}>
					SSID
				</Label>
				<Col sm={5}>
					<Input
						type="text"
						name="5-GHz-ssid"
						id="5-GHz-ssid-input"
						placeholder="min. 8 characters"
					/>
				</Col>
			</FormGroup>

			<FormGroup row>
				<Label for="5-GHz-password-input" sm={2}>
					Email
				</Label>
				<Col sm={5}>
					<Input
						type="password"
						name="5-GHz-password"
						id="5-GHz-password-input"
						placeholder="min. 8 characters"
					/>
				</Col>
			</FormGroup>

			<FormGroup check>
				<Label check>
					<Input type="checkbox" />
					Connect to a mesh
				</Label>
			</FormGroup>

			<FormGroup>
				<Button>Submit</Button>
			</FormGroup>

			<FormGroup>
				<Button>Revert</Button>
			</FormGroup>
		</Form>
	);
}
