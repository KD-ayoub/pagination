export default async function getItems(link: string, page?: string) {
    try {
        const url = page ? `http://18.218.97.172/app/items/?page=${page}`: link;
        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching data');
        }
        return await response.json();
    } catch (error) {
        console.log('Error :', error);
    }
}
