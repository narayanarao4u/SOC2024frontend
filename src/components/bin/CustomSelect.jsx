import React, { useState, useEffect, useRef, forwardRef, useContext } from 'react';
import './CustomSelect.css'; // Import CSS file for styles


const CustomSelect = ({ data, onFilter, tableColumns, selectedRow, setselectedRow, displayColumn, selectColumn, tabindex, setID }) => {




  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  const [timer, setTimer] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedRow) {

      setSelectedIndex(0)
      inputRef.current.value = selectedRow[displayColumn];
    }

  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => clearTimeout(timer);
  }, [timer]);

  useEffect(() => {
    // console.log(selectedRow, data, !isVisible);
    if (selectedRow && data && !isVisible) {
      inputRef.current.value = selectedRow[displayColumn];
    }

  }, [selectedRow]);


  const handleKeyDown = (e) => {
    let timeout;

    const div1 = document.querySelector('.customSelectTable');
    const selectedrow = document.querySelector(`[data-index = "${selectedIndex}"]`);
    const rowheight = selectedrow ? selectedrow.offsetTop : 0;

    if (e.key === 'ArrowDown') {

      if (selectedIndex > 8) {
        div1.scrollTop = rowheight;
        // selectedrow.style.top = '0px';
      }


      if (isVisible) {
        setSelectedIndex(prevIndex =>
          Math.min(prevIndex + 1, data.length - 1)
        );
      } else {
        setIsVisible(true);
      }

    } else if (e.key === 'ArrowUp') {
      if (selectedIndex > 8) {
        div1.scrollTop -= 19;
        // selectedrow.style.bottom = '0px';

      } else {
        div1.scrollTop = 0;
      }

      e.preventDefault();
      if (isVisible) {
        setSelectedIndex(prevIndex =>
          Math.max(prevIndex - 1, -1)
        );
      } else {
        setIsVisible(true);
      }
    } else if (e.key === 'Enter') { //&& selectedIndex !== -1
      lostfocus();
      setIsVisible(false); // Hide table when Enter is pressed

      try {
        const currentTabIndex = e.target.tabIndex;
        if (currentTabIndex) {
          const nextInput = e.target.form.elements[currentTabIndex];
          nextInput.focus();
        }
      } catch (error) {
        console.log(error);
      }





    } else {

      clearTimeout(timer);

      let newTimer = setTimeout(() => {
        onFilter(inputRef.current.value);
      }, 300);
      setTimer(newTimer);


    }


  };//End of handleKeyDown

  function lostfocus() {
    if (selectedIndex !== -1) {
      setselectedRow(data[selectedIndex]);

      if (data[selectedIndex]) {
        inputRef.current.value = data[selectedIndex][displayColumn];
        setID(data[selectedIndex][selectColumn]);
      }


    }
  }

  const handleInputFocus = (e) => {
    e.target.select();
    setIsVisible(true); // Show table when input is focused
  };

  const handleInputBlur = () => {
    lostfocus();
    // Hide table when input loses focus
    setIsVisible(false);

  };

  return (
    <div>

      <input
        type="text"
        placeholder="Filter..."

        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        tabIndex={tabindex}
      />
      {isVisible && (
        <div className='customSelectTable' >

          <table  >
            <thead>
              <tr>
                {data[0] && tableColumns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  data-index={index}
                  key={index}
                  className={index === selectedIndex ? 'selected' : ''}
                  onClick={() => setSelectedIndex(index)}
                >
                  {tableColumns.map((col, index) => (
                    <td key={index}>{item[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
