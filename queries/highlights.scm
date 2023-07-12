[ "--each" "--next" ] @repeat

(class_path
	class_path: (text) @string
	) @keyword

(dce
	dce: (dce_kind) @type
	) @keyword

(hxml_file) @include

(library
	name: (text) @variable
	) @keyword
(library
	name: (text) @variable
	version: (value) @number
	) @keyword

(main
	main: (text) @string
	) @keyword

(output
	target: (text) @string
	) @keyword
