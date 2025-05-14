import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Admin } from '@/types';
import { formatDate } from '@/lib/utils';
import { Pencil, Trash2, Lock } from 'lucide-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function renderStatus(status: string) {
    const color = status ? 'success' : 'error';
    const label = status ? 'Verified' : 'Not Verified';
    console.log('status ', status)
    return <Chip label={label} color={color} size="small" variant="outlined" />;
}

const columns: GridColDef[] = [
    {
        field: 'index',
        headerName: '#',
        width: 50,
        renderCell: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1
    },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
        field: 'email_verified_at',
        headerName: 'Verified',
        width: 170,
        renderCell: (params) => renderStatus(params.value)
    },
    {
        field: 'created_at',
        headerName: 'Created at',
        width: 170,
        renderCell: (params) => formatDate(params.value)
    },
    {
        field: 'updated_at',
        headerName: 'Updated at',
        width: 170,
        renderCell: (params) => formatDate(params.value)
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
    },
];

export const AdminsTable = () => {

    const [rows, setRows] = useState<Admin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    //delete admin
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDeleteClick = (id: number) => {
        setAdminToDelete(id);
        setDeleteDialogOpen(true);
    };
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setAdminToDelete(null);
    };
    const handleDeleteConfirm = async () => {
        if (!adminToDelete) return;

        setDeleteLoading(true);
        try {
            const response = await axios.delete(`/admin/${adminToDelete}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                setRows(rows.filter(row => row.id !== adminToDelete));
                setDeleteDialogOpen(false);
            } else {
                setError(response.data.message || 'Failed to delete admin');
            }
        } catch (err) {
            console.error('Error deleting admin:', err);

            let errorMessage = 'Failed to delete admin';
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.message || errorMessage;
            }

            setError(errorMessage);
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setAdminToDelete(null);
        }
    };

    const columnsWithHandlers = columns.map(column => {
        if (column.field === 'actions') {
            return {
                ...column,
                renderCell: (params: { row: { id: number; }; }) => (
                    <div className='flex gap-3 text-black'>
                        <button type="button" className='btn px-1 bg-transparent border-0
                            text-black shadow-none edit hover:text-blue-800'>
                            <Pencil />
                        </button>
                        <button
                            type="button"
                            className='btn px-1 bg-transparent border-0 text-black shadow-none delete hover:text-red-800'
                            onClick={() => handleDeleteClick(params.row.id)}
                        >
                            <Trash2 />
                        </button>
                        <button type="button" className='btn px-1 bg-transparent border-0
                            text-black shadow-none change-password hover:text-green-800'>
                            <Lock />
                        </button>
                    </div>
                )
            };
        }
        return column;
    });

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/admin/all', {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.data.success && Array.isArray(response.data.data)) {
                    setRows(response.data.data);
                    console.log('Setting rows to:', response.data.data);
                } else {
                    console.error('Unexpected API response format:', response.data);
                    setError('Received invalid data format from server');
                }
            } catch (err) {
                console.error('Error fetching admins:', err);
                setError('Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);
    return (
        <>
            <Paper sx={{ height: 600, width: 'fit-content' }}>
                {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
                <DataGrid
                    rows={rows}
                    columns={columnsWithHandlers}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25]}
                    loading={loading}
                    sx={{ border: 0 }}
                />
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Admin Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this admin? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        autoFocus
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


