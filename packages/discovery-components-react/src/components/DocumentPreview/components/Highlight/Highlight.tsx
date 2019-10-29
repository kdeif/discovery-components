import React, { FC, ReactElement } from 'react';
import {
  QueryResultPassage,
  QueryResult,
  QueryTableResult
} from '@disco-widgets/ibm-watson/discovery/v2';
import TableHighlight from './TableHighlight';
import PassageHighlight from './PassageHighlight';
import { isPassage } from './passages';
import { Bbox, Origin } from '../../types';

interface Props {
  /**
   * Document data returned by query
   */
  document?: QueryResult | null;

  /**
   * Page to display
   */
  currentPage: number;
  /**
   * Highlight descriptor, to be highlighted
   */
  highlight?: QueryResultPassage | QueryTableResult;

  /**
   * Classname for highlight <rect>
   */
  highlightClassname?: string;

  /**
   * Callback to set first page of found highlight
   */
  setHighlightFirstPage?: (page: number) => void;
}

export interface ChildrenProps {
  bboxes: Bbox[];
  origin: Origin;
  pageWidth: number;
  pageHeight: number;
}

// default PDF dimensions
export const DEFAULT_WIDTH = 612;
export const DEFAULT_HEIGHT = 792;
export const DEFAULT_ORIGIN = 'BottomLeft';

// padding to enlarge highlight box
const PADDING = 5;

export const Highlight: FC<Props> = props => {
  const { highlight, ...rest } = props;
  const { highlightClassname } = rest;
  if (!document || !highlight) {
    return null;
  }

  const Component = isPassage(highlight) ? PassageHighlight : TableHighlight;
  return (
    <Component highlight={highlight as any} {...rest}>
      {({ bboxes, origin, pageWidth, pageHeight }: ChildrenProps): ReactElement =>
        bboxes && (
          <svg
            viewBox={`0 0 ${pageWidth} ${pageHeight}`}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
          >
            {bboxes.map(([left, top, right, bottom]) => (
              <rect
                key={`${left}${top}${right}${bottom}`}
                className={highlightClassname}
                x={left - PADDING}
                y={(origin === 'TopLeft' ? top : pageHeight - top) - PADDING}
                width={right - left + PADDING}
                height={bottom - top + PADDING}
                data-testid="highlight"
              />
            ))}
          </svg>
        )
      }
    </Component>
  );
};

export default Highlight;