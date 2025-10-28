import { useState } from "react"

export function SearchOrSelect({Data,setIsShowOptions,setSelectId,setSelectIdName}){



    function normalize(str){
        return str.toLowerCase().replace(/[^a-z0-9 ]/gi,""); // keep space
    }

    const [filterData,setfilterData]=useState(Data);
    function handleFilter(e){
          const query = normalize(e.target.value).split(" "); // split input into word

        const updatedData= query.length === 0
                        ? Data // show all items if query is empty
                        : Data.filter((item) => {
                            const normalizedName = normalize(item.name);
                            return query.every((word) => normalizedName.includes(word));
                            });
        setfilterData(updatedData);
    }

    return(
        <>

        <div className="relative w-full bg-white">
        {/* ✅ Search Box */}

      <input
        type="text"
        placeholder="Search category..."
        className="w-full p-2 border-b border-gray-300 outline-none "
        onChange={handleFilter}
        autoFocus
      />


         {/* ✅ Filtered Results */}
      {filterData.map((category) => (
        <div
          key={category.id}
          className="cursor-pointer p-2 border-b border-gray-300 hover:bg-gray-200"
          onClick={() => {
            console.log("Selected:", category.id, category.name);
            // here you can call: 
             setSelectId(category.id)
              setSelectIdName(category.name)
            setIsShowOptions(false );
          }}
        >
          {category.name}
        </div>
      ))}
          </div>

        
        </>
    )
}