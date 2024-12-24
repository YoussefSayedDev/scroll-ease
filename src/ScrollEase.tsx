import { useEffect, useRef, useState } from "react";

const CustomScrollbar = ({ children }: { children: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollbarThumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);

  const handleScroll = () => {
    if (!contentRef.current || !scrollbarThumbRef.current) return;

    const content = contentRef.current;
    const thumb = scrollbarThumbRef.current;

    const scrollPercentage = content.scrollTop / content.scrollHeight;
    const thumbTop = scrollPercentage * content.clientHeight;

    thumb.style.top = `${thumbTop}px`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (contentRef.current) {
      setStartScrollTop(contentRef.current.scrollTop);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !contentRef.current) return;

    const deltaY = e.clientY - startY;
    const scrollPercentage =
      (deltaY / contentRef.current.clientHeight) *
      contentRef.current.scrollHeight;

    contentRef.current.scrollTop = startScrollTop + scrollPercentage;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const content = contentRef.current;

    content?.addEventListener("scroll", handleScroll);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      content?.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!contentRef.current) return;

    const percentageOfScroll =
      contentRef.current.clientHeight / contentRef.current.scrollHeight;

    const heightOfThumb = percentageOfScroll * contentRef.current.clientHeight;
    setThumbHeight(heightOfThumb);
  }, []);

  return (
    <div className="relative h-screen">
      <div
        ref={contentRef}
        className="customSidebar relative h-full select-none overflow-y-auto pr-4"
      >
        <div>{children}</div>
      </div>

      <div className="absolute right-0 top-0 h-full w-1 bg-gray-200 transition-all duration-300 hover:w-2">
        <div
          ref={scrollbarThumbRef}
          className="w-full cursor-pointer rounded bg-gray-600"
          style={{
            position: "absolute",
            height: `${thumbHeight}px`,
            top: 0,
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default CustomScrollbar;
