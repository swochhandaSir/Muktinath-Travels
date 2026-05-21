import { CKEditor } from "@ckeditor/ckeditor5-react";	
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Modal from "./Modal";
import { inputClass, labelClass } from "./bikeFormStyles";

export default function BlogFormModal({
	open,
	mode,
	
	blog,
	draft,
	onDraftChange,
	onTitleChange,
	formError,
	submitting,
	imageInputRef,
	onClose,
	onSubmit,
}) {
	const isAdd = mode === "add";

	const updateComment = (index, value) => {
		onDraftChange((d) => ({
			...d,
			comments: d.comments.map((item, i) => (i === index ? value : item)),
		}));
	};

	const addComment = () => {
		onDraftChange((d) => ({
			...d,
			comments: [...d.comments, ""],
		}));
	};

	const removeComment = (index) => {
		onDraftChange((d) => {
			if (d.comments.length <= 1) return d;
			return {
				...d,
				comments: d.comments.filter((_, i) => i !== index),
			};
		});
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			titleId="blog-form-title"
			title={isAdd ? "Add blog" : "Edit blog"}
			panelClassName="max-w-3xl "
			bodyScroll
			closeDisabled={submitting}
		>
			<form className="mt-4 space-y-4" onSubmit={onSubmit}>
				{formError && (
					<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
						{formError}
					</p>
				)}

				<div>
					<label htmlFor="blog-title" className={labelClass}>
						Title
					</label>
					<input
						id="blog-title"
						className={inputClass}
						value={draft.title}
						onChange={(e) => onTitleChange(e.target.value)}
						placeholder="Top 10 Tips for a Stress-Free Road Trip"
						autoComplete="off"
						disabled={submitting}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label htmlFor="blog-author" className={labelClass}>
							Author
						</label>
						<input
							id="blog-author"
							className={inputClass}
							value={draft.author}
							onChange={(e) =>
								onDraftChange((d) => ({ ...d, author: e.target.value }))
							}
							placeholder="Jane Doe"
							autoComplete="off"
							disabled={submitting}
						/>
					</div>
					<div>
						<label htmlFor="blog-slug" className={labelClass}>
							Slug
						</label>
						<input
							id="blog-slug"
							className={inputClass}
							value={draft.slug}
							onChange={(e) =>
								onDraftChange((d) => ({ ...d, slug: e.target.value }))
							}
							placeholder="top-10-tips-stress-free-road-trip"
							autoComplete="off"
							disabled={submitting}
						/>
					</div>
				</div>

				<div>
					<label htmlFor="blog-image" className={labelClass}>
						Image{" "}
						{!isAdd && (
							<span className="font-normal text-slate-500">
								(optional — leave empty to keep current)
							</span>
						)}
					</label>
					<input
						id="blog-image"
						ref={imageInputRef}
						type="file"
						accept="image/*"
						className={inputClass}
						disabled={submitting}
					/>
					{!isAdd && blog?.image && (
						<p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
							Current:{" "}
							<a
								href={blog.image}
								target="_blank"
								rel="noreferrer"
								className="text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
							>
								view image
							</a>
						</p>
					)}
				</div>

				<fieldset className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
					<legend className="px-1 text-sm font-medium text-slate-700 dark:text-slate-300">
						Comments
					</legend>
					{draft.comments.map((comment, index) => (
						<div
							key={index}
							className="grid gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50 sm:grid-cols-[1fr_auto]"
						>
							<div>
								<label
									htmlFor={`blog-comment-${index}`}
									className="text-xs font-medium text-slate-600 dark:text-slate-400"
								>
									Comment {index + 1}
								</label>
								<input
									id={`blog-comment-${index}`}
									className={inputClass}
									value={comment}
									onChange={(e) => updateComment(index, e.target.value)}
									placeholder="Write a comment"
									disabled={submitting}
								/>
							</div>
							<div className="flex items-end sm:justify-end">
								<button
									type="button"
									onClick={() => removeComment(index)}
									disabled={submitting || draft.comments.length <= 1}
									className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
								>
									Remove
								</button>
							</div>
						</div>
					))}
					<button
						type="button"
						onClick={addComment}
						disabled={submitting}
						className="rounded-lg border border-dashed border-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:bg-opacity-10 disabled:opacity-50 dark:text-[var(--color-primary)] dark:hover:bg-[var(--color-primary)] dark:hover:bg-opacity-10"
					>
						+ Add comment
					</button>
				</fieldset>

				<fieldset className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
					<legend className="px-1 text-sm font-medium text-slate-700 dark:text-slate-300">
						Description
					</legend>
					<div
						className="min-w-[200px] max-w-full overflow-x-hidden rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-800 [&_.ck.ck-editor]:min-w-0 [&_.ck.ck-editor__main]:min-w-0 [&_.ck.ck-editor__editable]:min-w-0 [&_.ck.ck-editor__editable]:max-w-full"
					>
						<CKEditor 
							editor={ClassicEditor}
							data={draft.description}
							disabled={submitting}
							onChange={(_event, editor) => {
								onDraftChange((d) => ({ ...d, description: editor.getData() }));
							}}
						/>
					</div>
				</fieldset>

				<div className="flex flex-wrap justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						disabled={submitting}
						className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={submitting}
						className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
					>
						{submitting ? "Saving..." : isAdd ? "Add blog" : "Save changes"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
