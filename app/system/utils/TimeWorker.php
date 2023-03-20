<?

namespace System\Utils;

class TimeWorker
{
	public static function timeToStamp($t = '*')
	{
		if ('' === $t) {
			return '';
		}
		if ('*' === $t) {
			$t = time();
		}
		return gmdate('YmdHis', $t);
	}

	public static function  stampToTime($p)
	{
		if (empty($p)) {
			return NULL;
		}
		$p = str_pad($p, 14, '0', STR_PAD_LEFT);
		return @gmmktime(@substr($p, 8, 2), @substr($p, 10, 2), @substr($p, 12, 2), @substr($p, 4, 2), @substr($p, 6, 2), @substr($p, 0, 4));
	}
}
