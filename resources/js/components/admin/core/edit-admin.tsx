import { Pencil } from 'lucide-react'

export const EditAdmin = () => {
    return (
        <button type="button"
                className='btn my-auto px-1 bg-transparent
                           border-0 text-black
                           shadow-none hover:text-blue-600'>
            <Pencil />
        </button>
    )
}
