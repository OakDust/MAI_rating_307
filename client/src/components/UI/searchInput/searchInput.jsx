import React, {useState, useMemo} from 'react';
import classes from './styles.module.scss';

const SearchInput = ({list, setValue, ...props}) => {
    const [selectQuery, setSelectQuery] = useState('');
    const [isDirtySelect, setIsDirtySelect] = useState(false);

    const searchedList = useMemo(() => {
        return list.filter(item => item.value.includes(selectQuery));

    }, [selectQuery, list])

    const searchHandler = (e) => {
        setSelectQuery(e.target.value);
        setValue(e.target.value);
        setIsDirtySelect(true);
        
    }

    const selectHandler = (item) => {
        setIsDirtySelect(false);
        setSelectQuery(item.value);
        setValue(item);
    }

    const showSearchedList = (searchedList) => {
        if (searchedList.length > 0 && searchedList.length !== list.length && isDirtySelect) {
            return (
                <ul>
                    {searchedList.map(item => (
                        <li onClick={() => selectHandler(item)}>{item.value}</li>
                    ))}
                </ul>
            )
        }
    }

    return( 
        <div className={classes.search__input}>
            <input
                {...props}
                value={selectQuery}
                onChange={(e) => searchHandler(e)}
            />

            {showSearchedList(searchedList)}
        </div>
    );
}
export default SearchInput;