import React, {useState, useMemo} from 'react';
import classes from './styles.module.scss';
import MyInput from '../myInput/myInput';
import dropDownIcon from '../../../assets/icons/dropdown.webp';

const SearchInput = ({list, searchKey, searchValue, setValue, onlyChoice, ...props}) => {
    const [selectQuery, setSelectQuery] = useState('');
    const [isDirtySelect, setIsDirtySelect] = useState(false);
    const [isOpenList, setIsOpenList] = useState(false);

    const searchedList = useMemo(() => {
        return list.filter(item => item[searchValue].toLowerCase().includes(selectQuery.toLowerCase()));

    }, [selectQuery, list])

    const searchHandler = (e) => {
        setSelectQuery(e.target.value);
        setIsDirtySelect(true);

        if (!onlyChoice) {
            setValue(e.target.value);
        } 
    }

    const selectHandler = (item) => {
        setIsDirtySelect(false);
        setIsOpenList(false);
        setSelectQuery(item[searchValue]);
        setValue(item);
    }

    const showSearchedList = () => {
        const visibleList = isOpenList ? list : searchedList;

        if ((searchedList.length > 0 && searchedList.length <= 20 && isDirtySelect && selectQuery.length > 0) || isOpenList) {
            return (
                <ul>
                    {visibleList.map(item => (
                        <li key={item[searchKey]} onClick={() => selectHandler(item)}>{item[searchValue]}</li>
                    ))}
                </ul>
            )
        }
    }

    return( 
        <div className={classes.search__input}>
            <MyInput
                {...props}
                value={selectQuery}
                onChange={(e) => searchHandler(e)}
            />

            <img 
                src={dropDownIcon} 
                alt='Открыть список'
                onClick={() => setIsOpenList(!isOpenList)}
                className={!isOpenList ? classes.dropDown__icon : classes['dropDown__icon'] + ' ' + classes.active}
            />

            {showSearchedList()}
        </div>
    );
}
export default SearchInput;