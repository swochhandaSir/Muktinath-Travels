import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";

export function emptyBikeDraft() {
	return {
		name: "",
		price: "",
		model: "",
		color: "",
		plateNumber: "",
		chassisNumber: "",
		engineNumber: "",
		mileage: "",
		available: true,
		engineCapacity: "",
		blueBookNumber: "",
	};
}

export function bikeToDraft(bike) {
	return {
		name: bike.name,
		price: String(bike.price),
		model: bike.model || "",
		color: bike.color || "",
		plateNumber: bike.plateNumber || "",
		chassisNumber: bike.chassisNumber || "",
		engineNumber: bike.engineNumber || "",
		mileage: String(bike.mileage ?? ""),
		available: bike.available ?? true,
		engineCapacity: String(bike.engineCapacity ?? ""),
		blueBookNumber: bike.blueBookNumber || "",
	};
}

export function useBikesAdmin() {
	const [bikes, setBikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formModal, setFormModal] = useState(null);
	const [draft, setDraft] = useState(emptyBikeDraft);
	const [formError, setFormError] = useState("");
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const imageInputRef = useRef(null);
	const licenseImageInputRef = useRef(null);
	const blueBookImagesInputRefs = useRef([]);

	const loadBikes = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/bikes"));
			if (!res.ok) throw new Error(await parseApiError(res));
			setBikes(await res.json());
		} catch (err) {
			setListError(err.message || "Failed to load bikes.");
			setBikes([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadBikes();
	}, [loadBikes]);

	useEffect(() => {
		if (!formModal) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				setFormModal(null);
				setFormError("");
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [formModal]);

	useEffect(() => {
		if (!deleteTarget) return;
		const onKey = (e) => {
			if (e.key === "Escape") setDeleteTarget(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [deleteTarget]);

	const resetImageInput = () => {
		if (imageInputRef.current) imageInputRef.current.value = "";
		if (licenseImageInputRef.current) licenseImageInputRef.current.value = "";
		for (const input of blueBookImagesInputRefs.current) {
			if (input) input.value = "";
		}
	};

	const openAdd = () => {
		setDraft(emptyBikeDraft());
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "add" });
	};

	const openEdit = (bike) => {
		setDraft(bikeToDraft(bike));
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "edit", bike });
	};

	const closeForm = () => {
		setFormModal(null);
		setFormError("");
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const name = draft.name.trim();
		const priceNum = Number.parseFloat(draft.price);
		const mileageNum = Number(draft.mileage || 0);
		const engineCapacityNum = Number(draft.engineCapacity || 0);
		const file = imageInputRef.current?.files?.[0];
		const licenseFile = licenseImageInputRef.current?.files?.[0];
		const blueBookFiles = blueBookImagesInputRefs.current.flatMap((input) =>
			Array.from(input?.files || []),
		);

		if (!name) {
			setFormError("Name is required.");
			return;
		}
		if (!Number.isFinite(priceNum) || priceNum < 0) {
			setFormError("Enter a valid price per day.");
			return;
		}
		if (!Number.isFinite(mileageNum) || mileageNum < 0) {
			setFormError("Enter a valid mileage.");
			return;
		}
		if (!Number.isFinite(engineCapacityNum) || engineCapacityNum < 0) {
			setFormError("Enter a valid engine capacity.");
			return;
		}
		if (formModal.mode === "add" && !file) {
			setFormError("Choose an image file.");
			return;
		}

		const fd = new FormData();
		fd.append("name", name);
		fd.append("price", String(priceNum));
		fd.append("model", draft.model.trim());
		fd.append("color", draft.color.trim());
		fd.append("plateNumber", draft.plateNumber.trim());
		fd.append("chassisNumber", draft.chassisNumber.trim());
		fd.append("engineNumber", draft.engineNumber.trim());
		fd.append("mileage", String(mileageNum));
		fd.append("available", String(Boolean(draft.available)));
		fd.append("engineCapacity", String(engineCapacityNum));
		fd.append("blueBookNumber", draft.blueBookNumber.trim());
		if (file) fd.append("image", file);
		if (licenseFile) fd.append("licenseImage", licenseFile);
		for (const blueBookFile of blueBookFiles) {
			fd.append("blueBookImages", blueBookFile);
		}

		setFormSubmitting(true);
		setFormError("");
		try {
			const url =
				formModal.mode === "add"
					? apiUrl("/api/bikes")
					: apiUrl(`/api/bikes/${formModal.bike.id}`);
			const res = await fetch(url, {
				method: formModal.mode === "add" ? "POST" : "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadBikes();
			closeForm();
		} catch (err) {
			setFormError(err.message || "Something went wrong.");
		} finally {
			setFormSubmitting(false);
		}
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		setDeleteSubmitting(true);
		try {
			const res = await fetch(apiUrl(`/api/bikes/${deleteTarget.id}`), {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadBikes();
			setDeleteTarget(null);
		} catch (err) {
			setListError(err.message || "Failed to delete bike.");
			setDeleteTarget(null);
		} finally {
			setDeleteSubmitting(false);
		}
	};

	return {
		bikes,
		loading,
		listError,
		loadBikes,
		formModal,
		draft,
		setDraft,
		formError,
		formSubmitting,
		imageInputRef,
		licenseImageInputRef,
		blueBookImagesInputRefs,
		deleteTarget,
		setDeleteTarget,
		deleteSubmitting,
		openAdd,
		openEdit,
		closeForm,
		submitForm,
		confirmDelete,
	};
}
