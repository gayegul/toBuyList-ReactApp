"use strict";

var React = require('react');
var ajax = require('jquery').ajax;

var makeupsData = [{brand: 'hello world', _id:1}, {brand: 'goodbye', id_:2 }];

var MakeupForm = React.createClass({
	getInitialState: function() {
		return {newMakeup: {brand: ''}};
	},
	handleChange: function(event) {
		this.setState({newMakeup: {brand: event.target.value}});
	},
	handleSubmit: function(event) {
		event.preventDefault();
		var newMakeup = this.state.newMakeup;
		ajax({
			url: this.props.url,
			contentType:'application/json',
			type: 'POST',
			data: JSON.stringify(newMakeup),
			success: function(data) {
				this.props.onNewMakeupSubmit(data);
				this.setState({newMakeup: {brand: ''}});
			}.bind(this),
			error:function(xhr, status, err) {
				console.log(err);
			}
		});
	},
	render: function() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label htmlFor="newmakeup">New Makeup</label>
				<input id="newmakeup" type="text" value={this.state.newMakeup.brand} onChange={this.handleChange} />
				<button type="submit">Create New Makeup</button>
			</form>
		)
	}
});

var Makeup = React.createClass({
	render: function() {
		return <li>{this.props.data.brand}</li>
	}
});

var EditingMakeup = React.createClass({
	getInitialState: function() {
		return {newBrand: this.props.brand};
	},
	handleChange: function(event) {
		this.setState({newBrand: event.target.value});
	},
	onClick: function() {

	},
	render: function() {
		return (
			<li>
				<form>
					<label htmlFor={"editMakeup + this.props._id"}>Edit Makeup</label>
					<input type="text" id={"editMakeup" + this.props.data._id} onChange={this.handleChange} value={newBrand} />
					<button type="submit">Save Makeup</button>
					<button onClick={this.cancel}>Cancel</button>
				</form>
			</li>
		)
	}
})

var MakeupList = React.createClass({
	render: function() {
		/*
		var makeups = [];
		for(var = 0; this.props.data.length; i++) {
			makeups.push(<Makeup data={this.props.data[i]} key={this.props.data[i]._id}/>);
		}
		*/
		var makeups = this.props.data.map(function(makeup) {
			if(makeup.editing) {
				return <EditMakeup data={makeup} key={makeup._id} />
			}
			return <Makeup data={makeup} key={makeup._id} />
		});
		return (
			<section>
				<h1>Makeups:</h1>
				<ul>
					{makeups}
				</ul>
			</section>
		)
	}
});

var MakeupsApp = React.createClass({
	getInitialState: function() {
		return {makeupsData: []};
	},
	onNewMakeup: function(makeup) {
		makeup._id = this.state.makeupsData.length + 1;
		var stateCopy = this.state;
		stateCopy.makeupsData.push(makeup);
		this.setState(stateCopy);
	},
	componentDidMount: function() {
		ajax({
			url: this.props.makeupsBaseUrl,
			dataType: 'json',
			success: function(data) {
				var state = this.state;
				state.makeupsData = data;
				this.setState(state);
			}.bind(this),
			error: function(xhr, status) {
				console.log(xhr, status);
			}
		});
	},
	render: function() {
		return (
			<main>
				<MakeupForm onNewMakeupSubmit={this.onNewMakeup}  url={this.props.makeupsBaseUrl} />
				<MakeupList data={this.state.makeupsData} />
			</main>
		)
	}
});

React.render(<MakeupsApp makeupsBaseUrl={'/api/v1/makeups'}/>, document.body);
