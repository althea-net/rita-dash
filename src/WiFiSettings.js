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
			<div
				style={{
					display: "flex",
					flexDirection: "column"
				}}>
				<div
					id="2.4GHz-div"
					style={{
						height: "auto",
						width: "auto",
						margin: "5%",
						padding: "5%",
						borderStyle: "solid"
					}}>
					<TwoGigLogin />
				</div>
				<div
					style={{
						height: "auto",
						width: "auto",
						margin: "5%",
						padding: "5%",
						borderStyle: "solid"
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
			<Label
				for="2.4-GHz-Form"
				style={{
					height: "100%",
					width: "100%",
					marginBottom: "20px",
					fontSize: "1.5em",
					textAlign: "center"
				}}>
				2.4 GHz
			</Label>

			<FormGroup id="2.4-GHz-Form" row>
				<Label for="2.4-GHz-ssid-input" sm={2}>
					SSID
				</Label>

				<Col sm={8}>
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
					Password
				</Label>
				<Col sm={8}>
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

			<FormGroup
				style={{
					display: "flex",
					marginTop: "20px",
					justifyContent: "flex-end"
				}}>
				<Button
					style={{
						width: "80px",
						marginRight: "20px"
					}}>
					Revert
				</Button>
				<Button
					style={{
						width: "80px"
					}}>
					Save
				</Button>
			</FormGroup>
		</Form>
	);
}

function FiveGigLogin() {
	return (
		<Form>
			<Label
				for="5-GHz-Form"
				style={{
					height: "100%",
					width: "100%",
					marginBottom: "20px",
					fontSize: "1.5em",
					textAlign: "center"
				}}>
				5 GHz
			</Label>

			<FormGroup id="5-GHz-Form" row>
				<Label for="5-GHz-ssid-input" sm={2}>
					SSID
				</Label>
				<Col sm={8}>
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
					Password
				</Label>
				<Col sm={8}>
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

			<FormGroup
				style={{
					display: "flex",
					marginTop: "20px",
					justifyContent: "flex-end"
				}}>
				<Button
					style={{
						width: "80px",
						marginRight: "20px"
					}}>
					Revert
				</Button>
				<Button
					style={{
						width: "80px"
					}}>
					Save
				</Button>
			</FormGroup>
		</Form>
	);
}
