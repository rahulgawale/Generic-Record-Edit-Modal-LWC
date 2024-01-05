/* Generic Component for record creation with lightning modal */
import { api } from "lwc";
import LightningModal from "lightning/modal";

export default class CreateRecordModalGeneric extends LightningModal {
	@api label;
	@api objectApiName;
	@api recordId;
	@api layoutType;
	@api saveButtonLabel = "Save";
	@api cancelButtonLabel = "Cancel";
	@api prefixedFieldValues;

	@api layoutItemProps = {
		size: "12" /* ,
		smallDeviceSize: "12",
		mediumDeviceSize: "",
		largeDeviceSize: "" */
	};

	isLoading = true;

	_fields;
	@api
	get fields() {
		return this._fields;
	}
	set fields(value) {
		this._fields = [...value];
	}

	handleSubmit(event) {
		// stop the form from submitting
		this.isLoading = true;
		event.preventDefault();

		let fields = { ...event.detail.fields };

		if (this.prefixedFieldValues) {
			fields = { ...fields, ...this.prefixedFieldValues };
		}

		console.log("fields", JSON.stringify(fields));

		this.template
			.querySelector("lightning-record-edit-form")
			.submit(fields);

		console.log("in submit");
	}

	handleLoad() {
		this.isLoading = false;
	}

	handleSuccess(event) {
		this.isLoading = false;

		let detail = event.detail;
		const evt = new CustomEvent("recordsavesuccess", {
			detail
		});
		this.dispatchEvent(evt);
		this.close();
	}

	handleError(error) {
		this.isLoading = false;
		let detail = error.detail;
		const evt = new CustomEvent("recordsaveerror", {
			detail
		});
		this.dispatchEvent(evt);
	}

	// Handle input changes and update the record object
	handleInputChange(event) {
		const fieldApiName = event.target.dataset.fieldName;
		const value = event.target.value;

		let detail = {
			fieldApiName,
			value
		};

		const evt = new CustomEvent("inputfieldchanged", {
			detail
		});
		this.dispatchEvent(evt);
	}

	@api updateFieldValue(fieldApiName, value) {
		this.template.querySelector(
			`lightning-input-field[data-field-name="${fieldApiName}"]`
		).value = value;
	}

	handleCancel() {
		this.close();
	}
}