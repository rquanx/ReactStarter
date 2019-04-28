import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import './index.css';

interface IPaginationProps {
    totalPage: number,
    id: string,
    currentPage?: number;
    pageBound?: number;
    prevText?: string;
    nextText?: string;
    isOnlyPrevNext?: boolean;
    onPageChange: (currentPage: number) => void;
}

interface IPaginationState {
    totalPage: number;// 总页数
    id: string;// 分页控件ID，为防止同个页面使用多个控件的冲突
    currentPage: number;// 当前页数
    upperPageBound: number;// 显示几个按钮
    lowerPageBound: number;
    isPrevBtnActive: string;
    isNextBtnActive: string;
    pageBound: number;
    prevText: string;
    nextText: string;
    isOnlyPrevNext: boolean;
}

export class Pagination extends React.Component<IPaginationProps, IPaginationState> {
    constructor(props) {
        super(props);
        this.state = {
            totalPage: this.props.totalPage,
            id: this.props.id,
            currentPage: this.props.currentPage,
            upperPageBound: this.props.pageBound ? this.props.pageBound : 3,
            lowerPageBound: 0,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: this.props.totalPage === this.props.currentPage ? "disabled" : "",
            pageBound: this.props.pageBound ? this.props.pageBound : 3,
            prevText: this.props.prevText,
            nextText: this.props.nextText,
            isOnlyPrevNext: this.props.isOnlyPrevNext
        };
        console.log("currentPage:" + this.state.currentPage + "&props.currentPage:" + this.props.currentPage);
    }

    // 默认值
    static defaultProps = {
        totalPage: 0,
        currentPage: 1,
        upperPageBound: 3,
        prevText: "Prev",
        nextText: "Next",
        isOnlyPrevNext: false
    }

    //属性发生改变
    componentWillReceiveProps(props) {
        if (props.totalPage != this.props.totalPage ||
            props.currentPage != this.props.currentPage ||
            props.pageBound != this.props.pageBound) {
            this.setState({
                totalPage: props.totalPage,
                currentPage: props.currentPage,
                pageBound: props.pageBound ? props.pageBound : this.props.pageBound,
            });

            if (props.currentPage == 1) {
                this.setState({
                    isPrevBtnActive: "disabled",
                    lowerPageBound: 0,
                    upperPageBound: 0 + props.pageBound
                })
            } else {
                this.setState({ isPrevBtnActive: "" })
            }

            if (props.totalPage == props.currentPage) {
                this.setState({ isNextBtnActive: "disabled" });
            } else {
                this.setState({ isNextBtnActive: "" });
            }
        }



    }

    componentWillMount() {

    }

    //点击数字
    @autobind
    handleClick(event) {
        let listid = Number(event.target.attributes["data-key"].value);
        this.setState({
            currentPage: listid
        });
        this.setPrevAndNextBtnClass(listid);
        this.props.onPageChange(listid);
    }

    @autobind
    setPrevAndNextBtnClass(listid) {
        this.setState({ isNextBtnActive: 'disabled' });
        this.setState({ isPrevBtnActive: 'disabled' });
        if (this.state.totalPage === listid && this.state.totalPage > 1) {
            this.setState({ isPrevBtnActive: '' });
        }
        else if (listid === 1 && this.state.totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
        }
        else if (this.state.totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
            this.setState({ isPrevBtnActive: '' });
        }
    }

    //点击...
    @autobind
    btnIncrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        let listid = this.state.upperPageBound + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
        this.props.onPageChange(listid);
    }

    //点击...
    @autobind
    btnDecrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
        this.props.onPageChange(listid);
    }

    //点击下一页
    @autobind
    btnPrevClick() {
        if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
            this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
        this.props.onPageChange(listid);
    }

    //点击上一页
    @autobind
    btnNextClick() {
        if ((this.state.currentPage + 1) > this.state.upperPageBound) {
            this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
        this.props.onPageChange(listid);
    }

    render() {
        const { currentPage, upperPageBound, lowerPageBound, isPrevBtnActive, isNextBtnActive } = this.state;
        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= this.state.totalPage; i++) {
            pageNumbers.push(i);
        }

        let renderPageNumbers = null;//要显示多少个按钮
        if (this.state.isOnlyPrevNext == false) {
            renderPageNumbers = pageNumbers.map(number => {
                if (number === currentPage) {
                    return (
                        <li key={number} className='active'><a href='javascript:void(0)' data-key={number} id={"sr-pagination-" + this.state.id + "-" + number} onClick={this.handleClick}>{number}</a></li>
                    )
                }
                else if ((number < upperPageBound + 1) && number > lowerPageBound) {
                    return (
                        <li key={number}><a href='javascript:void(0)' data-key={number} id={"sr-pagination-" + this.state.id + "-" + number} onClick={this.handleClick}>{number}</a></li>
                    )
                }
            });
        }
        let pageIncrementBtn = null;
        if (this.state.isOnlyPrevNext == false) {
            if (pageNumbers.length > upperPageBound) {
                pageIncrementBtn = <li className=''><a href='javascript:void(0)' onClick={this.btnIncrementClick}> &hellip; </a></li>
            }
        }
        let pageDecrementBtn = null;
        if (this.state.isOnlyPrevNext == false) {
            if (lowerPageBound >= 1) {
                pageDecrementBtn = <li className=''><a href='javascript:void(0)' onClick={this.btnDecrementClick}> &hellip; </a></li>
            }
        }
        let renderPrevBtn = null;
        let prevTextElement = null;
        if (this.state.prevText == "" || this.state.prevText == null) {
            prevTextElement = <span><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon></span>
        } else {
            prevTextElement = <span> {this.state.prevText} </span>
        }
        if (isPrevBtnActive === 'disabled') {
            renderPrevBtn = <li className={isPrevBtnActive}>{prevTextElement}</li>;
        }
        else {
            renderPrevBtn = <li className={isPrevBtnActive}><a href='javascript:void(0)' id="btnPrev" onClick={this.btnPrevClick}>{prevTextElement}</a></li>;
        }
        let renderNextBtn = null;
        let nextTextElement = null;
        if (this.state.prevText == "" || this.state.prevText == null) {
            nextTextElement = <span><FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon></span>
        } else {
            nextTextElement = this.state.nextText
        }
        if (isNextBtnActive === 'disabled') {
            renderNextBtn = <li className={isNextBtnActive}><span id="btnNext"> {nextTextElement} </span></li>
        }
        else {
            renderNextBtn = <li className={isNextBtnActive}><a href='javascript:void(0)' id="btnNext" onClick={this.btnNextClick}> {nextTextElement} </a></li>
        }
        return (
            <div className="sr-pagination-layout">
                <ul className="sr-pagination" id={"sr-pagination-" + this.state.id}>
                    {renderPrevBtn}
                    {pageDecrementBtn}
                    {renderPageNumbers}
                    {pageIncrementBtn}
                    {renderNextBtn}
                </ul>
            </div>
        );
    }
}


export default Pagination;