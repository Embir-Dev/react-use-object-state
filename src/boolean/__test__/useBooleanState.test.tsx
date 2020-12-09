import React from "react";
import { useBooleanState } from "../useBooleanState";
import { renderHook, act } from "@testing-library/react-hooks";
import ReactDOM from 'react-dom';
import { act as DOMAct } from 'react-dom/test-utils';

const MockUIWrapper = () => {
  const disabled = useBooleanState(false)

  const handleClick = () => {
    disabled.setTrue()
  }
  return <MockUIChild 
    isDisabled={disabled.state}
    onClick={handleClick}
  />
}

interface Props {
  isDisabled: boolean;
  onClick: VoidFunction
}
const MockUIChild = ({isDisabled, onClick}: Props) => {
  return <button disabled={isDisabled} onClick={onClick} />
}

describe("booleanState", () => {
  test("sets true", () => {
    const { result } = renderHook(() => useBooleanState(false));
    act(() => {
      result.current.setTrue();
    });
    expect(result.current.state).toEqual(true);
  });

  test("sets false", () => {
    const { result } = renderHook(() => useBooleanState(true));
    act(() => {
      result.current.setFalse();
    });
    expect(result.current.state).toEqual(false);
  });

  test("toggles state", () => {
    const { result } = renderHook(() => useBooleanState(false));
    act(() => {
      result.current.toggle();
    });
    expect(result.current.state).toEqual(true);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.state).toEqual(false);
  });

  test("tests well in UI", () => {
    // Standard React mount and state check
    const container = document.createElement('div');
    document.body.appendChild(container);
    DOMAct(() => {
      ReactDOM.render((
        <MockUIWrapper />
      ), container);
    });
    const button = container.querySelector('button');
    expect(button && button.disabled).toBeFalsy()
  

    // Lets update the state
    DOMAct(() => {
      button && button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });

    expect(button && button.disabled).toBeTruthy()
  })
});
