
export type itemsType = {
    id: number,
    title: string,
    price: number,
    url_image_product: string,
}

export type pageType = {
    count: number,
    next: string,
    previous: string,
    results: itemsType[],
}