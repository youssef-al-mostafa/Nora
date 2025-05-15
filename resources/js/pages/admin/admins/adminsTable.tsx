import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Admin } from '@/types';
import { formatDate } from '@/lib/utils';
import { Lock } from 'lucide-react';
import DeleteUserTable from '@/components/admin/core/delete-user-table';
import { EditAdmin } from '@/components/admin/core/edit-admin';
import { ChangeAdminPassword } from '@/components/admin/core/change-admin-password';


const renderStatus = (status: string) => {
    const color = status ? 'success' : 'error';
    const label = status ? 'Verified' : 'Not Verified';
    console.log('status ', status)
    return <Chip label={label} color={color} size="small" variant="outlined" />;
}

const columns: GridColDef[] = [
    {
        field: 'index',
        headerName: '#',
        flex: 0.5,
        renderCell: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1
    },
    { field: 'id', headerName: 'ID', flex: 0.7 },
    { field: 'name', headerName: 'Name', flex: 1.5 },
    { field: 'email', headerName: 'Email', flex: 2 },
    {
        field: 'email_verified_at',
        headerName: 'Verified',
        flex: 1.7,
        renderCell: (params) => renderStatus(params.value)
    },
    {
        field: 'created_at',
        headerName: 'Created at',
        flex: 1.7,
        renderCell: (params) => formatDate(params.value)
    },
    {
        field: 'updated_at',
        headerName: 'Updated at',
        flex: 1.7,
        renderCell: (params) => formatDate(params.value)
    },
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 2,
    },
];

export const AdminsTable = () => {

    const [rows, setRows] = useState<Admin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const columnsWithHandlers = columns.map(column => {
        if (column.field === 'actions') {
            return {
                ...column,
                renderCell: (params: { row: { id: number; }; }) => (
                    <div className='flex gap-3 text-black justify-evenly my-auto mx-auto h-full'>
                        {/* <EditAdmin/> */}
                        <DeleteUserTable adminId={params.row.id} />
                        <ChangeAdminPassword adminId={params.row.id}/>
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
            <Paper sx={{ height: 600, width: '100%', borderRadius: '1rem' }}>
                {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
                <DataGrid
                    rows={rows}
                    columns={columnsWithHandlers}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25]}
                    loading={loading}
                    sx={{
                        width: '100%',
                        borderRadius: '1rem',
                    }}
                />
            </Paper>
        </>
    );
}


