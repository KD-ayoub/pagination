import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import getItems from "./api/getItems";
import { pageType } from "./types/itemsType";
import { useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

function App() {
  const [page, setPage] = useState<pageType | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageRef = useRef(null);
  const url = "http://18.218.97.172/app/items/";
  console.log("here: ", searchParams.get("page"));
  function previous() {
    if (page && page.previous) {
      console.log("thereeee", page.previous.substring(url.length + 6));
      setSearchParams({ page: page.previous.substring(url.length + 6) || "1" });
      fetcher(page.previous);
    } else if (!page?.previous) {
      setSearchParams({ page: "1" });
    }
  }

  function next() {
    if (page && page.next) {
      console.log("thereeee", page.next.substring(url.length + 6));
      setSearchParams({ page: page.next.substring(url.length + 6) });
      fetcher(page.next);
    }
  }

  async function fetcher(link: string, page?: string) {
    if (searchParams.get("ordering")) {
      console.log("entered her ", searchParams.get("ordering"));
      const data: pageType = await getItems(link, page);
      data.results.sort((a, b) => {
        if (searchParams.get("ordering")?.toString() === "name") {
          return a.title.localeCompare(b.title); // Ascending order by name
        } else if (searchParams.get("ordering")?.toString() === "-name") {
          return b.title.localeCompare(a.title); // Descending order by name
        }
        return -1;
      });
      console.log("data results", data.results);
      setPage(data);
      return;
    }
    setPage(await getItems(link, page));
  }

  //////
  function handlPageChange(data: { selected: number }) {
    console.log("pagination ", data);
    console.log("ref ref ", pageRef.current);
    fetcher(url, (data.selected + 1).toString());
  }

  // function handlClick(data: { isNext: boolean; isPrevious: boolean }) {
  //   console.log('after click', data);
  //   if (data.isNext) {
  //     next();
  //     return ;
  //   }
  //   previous();
  // }
  /////

  useEffect(() => {
    fetcher(url, searchParams.get("page")?.toString());
    // can cause issues
    /*if (pageRef.current && searchParams.get("page"))
      pageRef.current.state.selected =
        parseInt(searchParams.get("page")!.toString());*/
    ///////
  }, []);
  console.log(page);
  return (
    <>
      <div className="container">
        <div className="head">rendred items</div>
        <div className="items-container">
          {page &&
            page.results.map((item) => {
              return (
                <div key={item.id} className="item">
                  <img
                    className="image-pic"
                    src={item.url_image_product}
                    alt="parfum"
                  />
                  <div>
                    <p className="title">{item.title}</p>
                    <div className="price-container">
                      <p className="price">Price</p>
                      <span className="price-number">{item.price}$</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="pagination">
        {/* <button onClick={previous}>previous</button>
        <button onClick={next}>next</button> */}
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={2100}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={handlPageChange}
          containerClassName="container-pagination"
          previousLinkClassName="prev-class"
          nextLinkClassName="prev-class"
          pageLinkClassName="prev-class"
          activeLinkClassName="active-link"
          ref={pageRef}
          // onClick={handlClick}
        />
      </div>
    </>
  );
}

export default App;
