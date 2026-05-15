import AdminLayout from "../layouts/AdminLayout";
import BikesTable from "../components/dashboard/BikesTable";
import BikeFormModal from "../components/dashboard/BikeFormModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DeleteBikeModal from "../components/dashboard/DeleteBikeModal";
import DeletePackageModal from "../components/dashboard/DeletePackageModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import PackageFormModal from "../components/dashboard/PackageFormModal";
import PackagesTable from "../components/dashboard/PackagesTable";
import { useBikesAdmin } from "../hooks/useBikesAdmin";
import { usePackagesAdmin } from "../hooks/usePackagesAdmin";

const Dashboard = () => {
	const bikesAdmin = useBikesAdmin();
	const packagesAdmin = usePackagesAdmin();

	return (
		<AdminLayout>
			<section id="bikes" className="scroll-mt-6">
				<DashboardHeader
					title="Bikes"
					addLabel="+ Add Bike"
					onAdd={bikesAdmin.openAdd}
				/>

				<ListErrorBanner
					message={bikesAdmin.listError}
					onRetry={bikesAdmin.loadBikes}
				/>

				<BikesTable
					bikes={bikesAdmin.bikes}
					loading={bikesAdmin.loading}
					onEdit={bikesAdmin.openEdit}
					onDelete={bikesAdmin.setDeleteTarget}
				/>

				<BikeFormModal
					open={Boolean(bikesAdmin.formModal)}
					mode={bikesAdmin.formModal?.mode}
					bike={bikesAdmin.formModal?.bike}
					draft={bikesAdmin.draft}
					onDraftChange={bikesAdmin.setDraft}
					formError={bikesAdmin.formError}
					submitting={bikesAdmin.formSubmitting}
					imageInputRef={bikesAdmin.imageInputRef}
					onClose={bikesAdmin.closeForm}
					onSubmit={bikesAdmin.submitForm}
				/>

				<DeleteBikeModal
					bike={bikesAdmin.deleteTarget}
					submitting={bikesAdmin.deleteSubmitting}
					onCancel={() => bikesAdmin.setDeleteTarget(null)}
					onConfirm={bikesAdmin.confirmDelete}
				/>
			</section>

			<section id="packages" className="mt-16 scroll-mt-6">
				<DashboardHeader
					title="Packages"
					addLabel="+ Add Package"
					onAdd={packagesAdmin.openAdd}
				/>

				<ListErrorBanner
					message={packagesAdmin.listError}
					onRetry={packagesAdmin.loadPackages}
				/>

				<PackagesTable
					packages={packagesAdmin.packages}
					loading={packagesAdmin.loading}
					onEdit={packagesAdmin.openEdit}
					onDelete={packagesAdmin.setDeleteTarget}
				/>

				<PackageFormModal
					open={Boolean(packagesAdmin.formModal)}
					mode={packagesAdmin.formModal?.mode}
					pkg={packagesAdmin.formModal?.pkg}
					draft={packagesAdmin.draft}
					onDraftChange={packagesAdmin.setDraft}
					formError={packagesAdmin.formError}
					submitting={packagesAdmin.formSubmitting}
					imageInputRef={packagesAdmin.imageInputRef}
					onClose={packagesAdmin.closeForm}
					onSubmit={packagesAdmin.submitForm}
				/>

				<DeletePackageModal
					pkg={packagesAdmin.deleteTarget}
					submitting={packagesAdmin.deleteSubmitting}
					onCancel={() => packagesAdmin.setDeleteTarget(null)}
					onConfirm={packagesAdmin.confirmDelete}
				/>
			</section>
		</AdminLayout>
	);
};

export default Dashboard;
