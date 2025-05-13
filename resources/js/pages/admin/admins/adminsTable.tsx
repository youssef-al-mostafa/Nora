import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Admin } from '@/types';

function renderStatus(status: boolean) {
    const color = status ? 'success' : 'error';
    const label = status ? 'Verified' : 'Not Verified';

    return <Chip label={label} color={color} size="small" variant="outlined" />;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
        field: 'verified',
        headerName: 'Verified',
        width: 120,
        renderCell: (params) => renderStatus(params.value)
    },
    { field: 'created_at', headerName: 'Created at', width: 130 },
    { field: 'updated_ad', headerName: 'Updated at', width: 130 },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 130,
        renderCell: (params) => (
            <div>
                {/* Action buttons can go here */}
            </div>
        )
    },
];

// const rows = [
//     { id: 1, name: 'Jon', email: 'jon@example.com', verified: true, created_at: '2021-10-01', updated_at: '2021-10-02', actions: 'Edit' },
//     { id: 2, name: 'Cersei', email: 'cersei@example.com', verified: false, created_at: '2021-10-03', updated_at: '2021-10-04', actions: 'Delete' },
//     { id: 3, name: 'Jaime', email: 'jaime@example.com', verified: true, created_at: '2021-10-05', updated_at: '2021-10-06', actions: 'Edit' },
//     { id: 4, name: 'Arya', email: 'arya@example.com', verified: true, created_at: '2021-10-07', updated_at: '2021-10-08', actions: 'Delete' },
//     { id: 5, name: 'Daenerys', email: 'daenerys@example.com', verified: false, created_at: '2021-10-09', updated_at: '2021-10-10', actions: 'Edit' },
//     { id: 6, name: 'Melisandre targeryan ', email: 'melisandre@example.com', verified: true, created_at: '2021-10-11', updated_at: '2021-10-12', actions: 'Delete' },
//     { id: 7, name: 'Ferrara', email: 'ferrara@example.com', verified: true, created_at: '2021-10-13', updated_at: '2021-10-14', actions: 'Edit' },
//     { id: 8, name: 'Rossini', email: 'rossini@example.com', verified: false, created_at: '2021-10-15', updated_at: '2021-10-16', actions: 'Delete' },
//     { id: 9, name: 'Harvey', email: 'harvey@example.com', verified: true, created_at: '2021-10-17', updated_at: '2021-10-18', actions: 'Edit' },
//     { id: 10, name: 'Snow', email: 'snow@example.com', verified: true, created_at: '2021-10-19', updated_at: '2021-10-20', actions: 'Delete' },
//     { id: 11, name: 'Lannister', email: 'lannister@example.com', verified: false, created_at: '2021-10-21', updated_at: '2021-10-22', actions: 'Edit' },
//     { id: 12, name: 'Stark', email: 'stark@example.com', verified: true, created_at: '2021-10-23', updated_at: '2021-10-24', actions: 'Delete' },
//     { id: 13, name: 'Targaryen', email: 'targaryen@example.com', verified: true, created_at: '2021-10-25', updated_at: '2021-10-26', actions: 'Edit' },
//     { id: 14, name: 'Melisandre', email: 'melisandre@example.com', verified: false, created_at: '2021-10-27', updated_at: '2021-10-28', actions: 'Delete' },
//     { id: 15, name: 'Clifford', email: 'clifford@example.com', verified: true, created_at: '2021-10-29', updated_at: '2021-10-30', actions: 'Edit' },
//     { id: 16, name: 'Frances', email: 'frances@example.com', verified: false, created_at: '2021-11-01', updated_at: '2021-11-02', actions: 'Delete' },
//     { id: 17, name: 'Roxie', email: 'roxie@example.com', verified: true, created_at: '2021-11-03', updated_at: '2021-11-04', actions: 'Edit' },
// ];

const getAllAdmins = async () => {
    const response = await axios.get('/admin/all', {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    console.log(response.data);
    const rows = response.data;
}

export const AdminsTable = () => {

    const [rows, setRows] = useState<Admin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

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
        <Paper sx={{ height: 600, width: 'fit-content' }}>
            {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
            <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25]}
                loading={loading}
                sx={{ border: 0 }}
            />
        </Paper>
    );
}


